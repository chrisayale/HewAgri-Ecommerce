import * as React from 'react';
import { View, Text, StatusBar, TouchableHighlight, Image } from 'react-native';
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

  const [isloading, setisloading] = React.useState(false);

  const __ = async () => {
    Netinfo.fetch().then(_ => {
      if (_.isConnected ) { // && _.isInternetReachable
        setisloading(true);
        onRunRetrieveQRY({
          table: tbl_users,
          limit: 1
        }, (er, done) => {
          // return false;
          if (done && done['length'] > 0) {
            const { token, idcooperative, typeaccount } = done[0];
            global.user = done[0];
            global.token = token;
            global.idcooperative = idcooperative
            switch (parseInt(typeaccount)) {
              case 2:
                onRunExternalRQST({
                  method: "GET",
                  url: `/cooperatives/cooperative/${idcooperative}`
                }, (err, done) => {
                  // onRunRemoveQRY({ table: tbl_users, clause: "" }, (e, d) => {})
                  if (done) {
                    const { status, message, data } = done;
                    if (status === 200) {
                      global.coopec = data;
                      navigation.replace("tabs");
                    } else {
                      setisloading(false)
                      Snackbar.show({
                        text: "Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.dangerColor
                      });
                    }
                  } else {
                    setisloading(false)
                    Snackbar.show({
                      text: "Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer",
                      duration: Snackbar.LENGTH_LONG,
                      backgroundColor: Colors.dangerColor
                    });
                  }
                })
                break;
              case 1:
                navigation.replace('tabs');
                break;
              default:
                return navigation.replace("app-auth");
                break;
            }
          } else navigation.replace("app-auth");
        });
      } else {
        setisloading(false)
        Snackbar.show({
          text: "Vous devez connecter cet appareil sur internet, avant de continuer, avec vos opétations",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: Colors.dangerColor
        });
      }
    })
  };

  const loadFonts = async () => {
    setisloading(true)
    await Fonts.loadAsync({
      "mons-e": require("../../assets/fonts/Poppins-ExtraLight.ttf"),
      "mons-a": require("../../assets/fonts/Poppins-Regular.ttf"),
      "mons": require("../../assets/fonts/Poppins-SemiBold.ttf"),
      "mons-b": require("../../assets/fonts/Poppins-Medium.ttf")
    })
      .then(_ => {
        __()
      })
      .catch(err => {
        Snackbar.show({
          text: "Erreur de chargement des paramètre de configuration",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: Colors.dangerColor
        });
      })

    // setappready(true);
  };

  React.useEffect(() => {
    loadFonts();
    const unsubscribe = Netinfo.addEventListener((e) => {
      if (e.isConnected && e.isInternetReachable) {
        __()
      }
    })
    return () => {
      unsubscribe()
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={"light-content"} backgroundColor={Colors.primaryColor} />
      {isloading && (
        <View style={{ flex: 1, alignContent: "center", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <View style={{}}>
            {/* <Image
              source={require("../../assets/images/hewagri-logo.png")}
              style={{
                alignSelf: "center",
                resizeMode: "center",
                width: 200,
                // height: 
              }}
            /> */}
            <Loader size={72} color={Colors.primaryColor} />
          </View>
        </View>
      )}
      {!isloading ? (
        <View style={{ width: "100%", height: Dims.height, display: "flex", flexDirection: "column", alignContent: "center", alignItems: "center", alignSelf: "center", justifyContent: "center" }}>
          <MaterialIcons name="wifi-off" size={200} color={'red'} />
          <View style={{ width: "90%", alignSelf: "center", alignContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Pas d'internet</Text>
            <Text style={{ fontSize: 13, textAlign: "center" }}>Pas de connexion internet activer le wifi ou les données mobiles, pour continuer avec l'utilisation du POS</Text>
          </View>
          <TouchableHighlight
            underlayColor={Colors.primaryColor}
            onPress={() => loadFonts()}
            style={[btn, { width: 200, marginTop: 20 }]}
          >
            <Text style={{ color: "white", fontWeight: "400" }}>Réessayer</Text>
          </TouchableHighlight>
        </View>
      ) : <></>}
      <View style={{ position: "absolute", bottom: "2%", width: "98%" }}>
        <Text style={{ textAlign: "center" }}>&copy; {appname} | {appnamecompangyname} {new Date().getFullYear()} </Text>
      </View>
    </View>
  )
}