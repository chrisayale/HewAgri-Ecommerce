import * as React from 'react';
import { View, Text, StatusBar, TouchableHighlight, Image, Platform } from 'react-native';
import * as Fonts from 'expo-font';
import { onDeconnextion, onRunExternalRQST, onRunRemoveQRY, onRunRetrieveQRY } from '../../services/communications';
import { Loader } from '../../components/Loader/comp.loader';
import { appname, appnamecompangyname } from '../../assets/configs/configs';
import { Colors } from '../../assets/colors/Colors';
import { tbl_users } from '../../services/tables/tables';
import Snackbar from 'react-native-snackbar'
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { btn } from '../../assets/styles/Styles';
import Netinfo from '@react-native-community/netinfo';
import { routes } from '../../assets/helper/helper.routes';

export const LoadingSceen = ({ navigation }) => {

  const [isloading, setisloading] = React.useState(true); // Start with true to show loader immediately
  const [error, setError] = React.useState(null);

  const navigateToAuth = () => {
    console.log('[LoadingScreen] Navigating to app-auth (no user session)');
    navigation.replace("app-auth");
  };

  const navigateToTabs = (userData) => {
    console.log('[LoadingScreen] Navigating to tabs with user:', userData?.id);
    navigation.replace("tabs");
  };

  const handleApiError = (context, err) => {
    const msg = `${context}: ${err?.message || err || 'Unknown error'}`;
    console.error('[LoadingScreen] ERROR:', msg);
    setError(msg);
    setisloading(false);

    // Determine if it's a network error or DB/local error
    const isNetworkError = context.includes('network') ||
                           context.includes('Network') ||
                           context.includes('fetch') ||
                           context.includes('External') ||
                           (err && err.message && (err.message.includes('Network') || err.message.includes('timeout')));

    const isDBError = context.includes('DB') || context.includes('Database') || context.includes('query');

    let snackbarText = "Erreur de connexion. Vérifiez votre connexion internet.";
    let errorTitle = "Connexion requise";
    let errorMessage = "Activez le Wi-Fi ou les données mobiles pour continuer avec l'application POS";

    if (isDBError) {
      snackbarText = "Erreur de base de données locale. Réessayez ou réinstallez l'application.";
      errorTitle = "Erreur de base de données";
      errorMessage = "Impossible d'accéder aux données locales. Réessayez ou réinstallez l'application.";
    } else if (!isNetworkError) {
      snackbarText = "Une erreur est survenue. Réessayez.";
      errorTitle = "Erreur";
      errorMessage = "Une erreur inattendue est survenue. Veuillez réessayer.";
    }

    Snackbar.show({
      text: snackbarText,
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: Colors.dangerColor
    });

    // Store error info for UI
    setError({ message: msg, title: errorTitle, description: errorMessage, isDBError, isNetworkError });
  };

  const checkUserSession = async () => {
    console.log('[LoadingScreen] Checking network connectivity...');
    try {
      const netInfo = await Netinfo.fetch();
      console.log('[LoadingScreen] Network status:', netInfo.isConnected, netInfo.isInternetReachable);

      if (!netInfo.isConnected) {
        console.log('[LoadingScreen] No network connection');
        setisloading(false);
        Snackbar.show({
          text: "Pas de connexion internet. Activez le wifi ou les données mobiles.",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: Colors.dangerColor
        });
        return;
      }

      console.log('[LoadingScreen] Fetching user from local DB...');

      // Add a timeout to prevent hanging
      const dbTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB query timeout')), 10000)
      );

      try {
        await Promise.race([
          new Promise((resolve, reject) => {
            onRunRetrieveQRY({ table: tbl_users, limit: 1 }, (er, done) => {
              if (er) {
                reject(er);
              } else {
                resolve(done);
              }
            });
          }),
          dbTimeout
        ]).then((done) => {
          console.log('[LoadingScreen] DB result:', done);

          if (done && done.length > 0) {
            const user = done[0];
            const { token, idcooperative, typeaccount } = user;
            global.user = user;
            global.token = token;
            global.idcooperative = idcooperative;
            console.log('[LoadingScreen] User found:', { id: user.id, typeaccount, idcooperative });

            switch (parseInt(typeaccount)) {
              case 2: // Cooperative user - validate with backend
                console.log('[LoadingScreen] Type 2 user, validating cooperative with backend...');
                onRunExternalRQST({
                  method: "GET",
                  url: `/cooperatives/cooperative/${idcooperative}`
                }, (err, res) => {
                  if (err) {
                    handleApiError('Cooperative validation failed', err);
                    return;
                  }
                  if (res && res.status === 200) {
                    global.coopec = res.data;
                    console.log('[LoadingScreen] Cooperative validated, navigating to tabs');
                    navigateToTabs(user);
                  } else {
                    console.log('[LoadingScreen] Cooperative validation failed, status:', res?.status);
                    navigateToAuth();
                  }
                });
                break;
              case 1: // Simple user
                console.log('[LoadingScreen] Type 1 user, navigating to tabs');
                navigateToTabs(user);
                break;
              default:
                console.log('[LoadingScreen] Unknown typeaccount, navigating to auth');
                navigateToAuth();
            }
          } else {
            console.log('[LoadingScreen] No user in DB, navigating to auth');
            navigateToAuth();
          }
        });
      } catch (dbErr) {
        handleApiError('DB query failed or timed out', dbErr);
      }
    } catch (err) {
      handleApiError('checkUserSession failed', err);
    }
  };

  const initializeApp = async () => {
    console.log('[LoadingScreen] Starting app initialization...');
    try {
      // Load fonts with timeout
      console.log('[LoadingScreen] Loading fonts...');
      await Promise.race([
        Fonts.loadAsync({
          "mons-e": require("../../assets/fonts/Poppins-ExtraLight.ttf"),
          "mons-a": require("../../assets/fonts/Poppins-Regular.ttf"),
          "mons": require("../../assets/fonts/Poppins-SemiBold.ttf"),
          "mons-b": require("../../assets/fonts/Poppins-Medium.ttf")
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Font loading timeout')), 15000))
      ]);
      console.log('[LoadingScreen] Fonts loaded');

      // On web, ensure IndexedDB is ready
      if (Platform.OS === 'web') {
        console.log('[LoadingScreen] Waiting for IndexedDB...');
        // The dbconnect.web initialize() is called in constructor, wait a bit
        await Promise.race([
          new Promise(r => setTimeout(r, 100)),
          new Promise((_, reject) => setTimeout(() => reject(new Error('IndexedDB init timeout')), 5000))
        ]);
        console.log('[LoadingScreen] IndexedDB ready');
      }

      // Hide splash screen if available
      if (Platform.OS !== 'web') {
        try {
          const SplashScreen = require('expo-splash-screen').default;
          await Promise.race([
            SplashScreen.hideAsync(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('SplashScreen timeout')), 5000))
          ]);
          console.log('[LoadingScreen] Splash screen hidden');
        } catch (e) {
          console.warn('[LoadingScreen] SplashScreen.hideAsync not available or timed out:', e.message);
        }
      }

      // Check user session
      await checkUserSession();
    } catch (err) {
      handleApiError('initializeApp failed', err);
    }
  };

  React.useEffect(() => {
    initializeApp();

    // Also listen for network changes
    const unsubscribe = Netinfo.addEventListener((state) => {
      console.log('[LoadingScreen] Netinfo listener triggered:', state.isConnected, state.isInternetReachable);
      if (state.isConnected && state.isInternetReachable && !isloading && error) {
        console.log('[LoadingScreen] Network restored, retrying...');
        setError(null);
        initializeApp();
      }
    });

    return () => unsubscribe();
  }, []);

  // Render
  if (isloading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <StatusBar barStyle={"dark-content"} backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <View style={{ alignItems: "center" }}>
            <Loader size={72} color={Colors.primaryColor} />
            <Text style={{ marginTop: 16, fontSize: 14, color: Colors.greyColor }}>Chargement...</Text>
          </View>
        </View>
        <View style={{ position: "absolute", bottom: "2%", width: "100%", alignItems: "center" }}>
          <Text style={{ textAlign: "center", fontSize: 10, color: Colors.greyColor }}>
            &copy; {appname} | {appnamecompangyname} {new Date().getFullYear()}
          </Text>
        </View>
      </View>
    );
  }

  // Error state - show retry
  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar barStyle={"dark-content"} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
        {error?.isDBError ? (
          <MaterialIcons name="storage" size={200} color={Colors.dangerColor} />
        ) : (
          <MaterialIcons name="wifi-off" size={200} color={Colors.dangerColor} />
        )}
        <View style={{ width: "90%", alignItems: "center", marginTop: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", color: Colors.textColor }}>
            {error?.title || "Connexion requise"}
          </Text>
          <Text style={{ fontSize: 13, textAlign: "center", color: Colors.greyColor, marginTop: 8 }}>
            {error?.description || "Activez le Wi-Fi ou les données mobiles pour continuer avec l'application POS"}
          </Text>
          {error?.message && (
            <Text style={{ fontSize: 11, textAlign: "center", color: Colors.dangerColor, marginTop: 8 }}>
              {error.message}
            </Text>
          )}
        </View>
        <TouchableHighlight
          underlayColor={Colors.primaryColor}
          onPress={() => { setisloading(true); setError(null); initializeApp(); }}
          style={[btn, { width: 200, marginTop: 20 }]}
        >
          <Text style={{ color: "white", fontWeight: "400" }}>Réessayer</Text>
        </TouchableHighlight>
      </View>
      <View style={{ position: "absolute", bottom: "2%", width: "100%", alignItems: "center" }}>
        <Text style={{ textAlign: "center", fontSize: 10, color: Colors.greyColor }}>
          &copy; {appname} | {appnamecompangyname} {new Date().getFullYear()}
        </Text>
      </View>
    </View>
  );
}