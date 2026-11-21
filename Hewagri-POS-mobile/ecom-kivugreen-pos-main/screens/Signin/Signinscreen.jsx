import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, ScrollView, Keyboard, TouchableHighlightBase, RefreshControl, Platform } from 'react-native';
import { Colors } from '../../assets/styles/Styles';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Header } from '../../components/Header/comp.header';
import { AntDesign, Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import { btn, inputGroup } from '../../assets/styles/Styles';
import { Divider } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { onRunExternalRQST, onRunInsertQRY, onRunRemoveQRY } from '../../services/communications';
import DialogBox from 'react-native-dialogbox';
import { FontAwesome5 } from '@expo/vector-icons';
import { Loader } from '../../components/Loader/comp.loader';
import { tbl_users } from '../../services/tables/tables';
import Snackbar from 'react-native-snackbar'
import Spinner from 'react-native-loading-spinner-overlay';
import { appnamecompangyname } from '../../assets/configs/configs';
import { routes } from '../../assets/helper/helper.routes';
import {
  screenContainer,
  screenContainerCentered,
  section,
  sectionTitle,
  sectionSubtitle,
  fieldGroup,
  fieldRow,
  divider,
  dividerVertical,
  text,
  btnPrimary,
  btnPrimaryLg,
  btnGhost,
  btnGhostLg,
  input,
  inputLabel,
  inputErrorText,
  card,
  cardElevated,
  flexRow,
  flexRowCenter,
  flexColCenter,
  avatarMd,
  badgePrimary,
  loadingOverlay,
  touchableOpacity,
  Shadows,
} from '../../assets/styles/Styles';
import { useWindowDimensions } from 'react-native';

export const SigninScreen = ({ navigation, route }) => {

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && width > 768;
  const formMaxWidth = isDesktop ? 420 : '90%';

  const [isloading, setisloading] = React.useState(false);
  const [num, setnum] = React.useState("");
  const [password, setpassword] = React.useState("");
  const [eye, seteye] = React.useState(true);
  const [output, setoutput] = React.useState("");
  const ref = React.useRef();

  const onSubmit = async () => {
    setoutput("");
    if (num.length > 0) {
      if (password.length > 0) {
        setisloading(true)
        try {
          await onRunExternalRQST({
            method: "POST",
            url: "/users/user/auth",
            data: {
              phone: num,
              password
            }
          }, (err, done) => {
            if (done) {
              setisloading(false)
              const { status, data, message } = done;
              switch (status) {
                case 200:
                  const { user, token } = data
                  const {
                    nom,
                    id,
                    postnom,
                    prenom,
                    phone,
                    lastlogin,
                    uuid,
                    sexe,
                    hectare_cultive,
                    date_naiss,
                    __tbl_ecom_roles,
                    avatar,
                    email,
                    id_cooperative
                  } = user;

                  const roles = Array.from(__tbl_ecom_roles).map(r => r && r['id'])

                  // STRICT ROLE VALIDATION: Only allow Coop Admin (has cooperative) or Livreur (role 3)
                  const hasCooperative = !isNaN(id_cooperative);
                  const isLivreur = roles.includes(3); // role 3 = manager = Livreur
                  const isCoopAdmin = hasCooperative && (roles.includes(2) || roles.includes(1)); // role 2 = admin, role 1 = super_admin

                  if (!isCoopAdmin && !isLivreur) {
                    setoutput(`Accès refusé : seuls les comptes Coopérative (Admin) et Livreur peuvent se connecter au POS.`)
                    Snackbar.show({
                      numberOfLines: 10,
                      text: `Accès refusé : seuls les comptes Coopérative (Admin) et Livreur peuvent se connecter au POS.`,
                      duration: Snackbar.LENGTH_LONG,
                      backgroundColor: Colors.dangerColor
                    });
                    return;
                  }

                  const typeaccount = isCoopAdmin ? 2 : 1; // 2 = Coop Admin, 1 = Livreur
                  const cooperativeId = isCoopAdmin ? id_cooperative : 0;

                  // Clear existing users first to avoid seed data conflicts
                  onRunRemoveQRY({ table: tbl_users, clause: '' }, (err, done) => {
                    if (err) {
                      console.error('[SigninScreen] Clear users error:', err);
                      // Continue anyway - the insert will handle duplicates
                    }
                    console.log('[SigninScreen] API auth response data:', JSON.stringify(data, null, 2));
                    console.log('[SigninScreen] Inserting user with:', {
                      realid: id,
                      nom,
                      postnom,
                      prenom,
                      token: token.substring(0, 20) + '...',
                      phone,
                      email,
                      lastlogin,
                      uuid,
                      avatar,
                      idcooperative: cooperativeId,
                      sexe,
                      roles: JSON.stringify(roles),
                      typeaccount
                    });

                    onRunInsertQRY({
                    table: tbl_users,
                    columns: `'id', 'realid', 'nom', 'postnom', 'prenom', 'token', 'phone', 'email', 'lastlogin', 'uuid', 'avatar', 'idcooperative', 'chaine', 'crearedon', 'sexe', 'roles', 'typeaccount'`,
                    dot: "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?",
                    values: [`${id}`, `${id}`, `${nom}`, `${postnom}`, `${prenom}`, `${token}`, `${phone}`, `${email}`, `${lastlogin}`, `${uuid}`, `${avatar}`, `${cooperativeId}`, `${JSON.stringify(data)}`, `${new Date().toLocaleString()}`, `${sexe}`, `${JSON.stringify(roles)}`, `${typeaccount}`]
                  }, (err, insert) => {
                    if (err) {
                      console.error('[SigninScreen] Local DB insert error:', err);
                      setoutput(`Erreur lors de l'enregistrement de la session locale: ${err.message || err}`);
                      Snackbar.show({
                        text: `Erreur lors de l'enregistrement de la session locale: ${err.message || err}`,
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.dangerColor
                      });
                      return;
                    }
                    if (insert) {
                      global.token = token;
                      global.user = insert;

                      if (isCoopAdmin) {
                        // Fetch cooperative details for Coop Admin
                        onRunExternalRQST({
                          method: "GET",
                          url: `/cooperatives/cooperative/${cooperativeId}`
                        }, (err, done) => {
                          if (done) {
                            const { status, message, data } = done;
                            if (status === 200) {
                              global.idcooperative = cooperativeId
                              global.coopec = data;
                              navigation.replace("tabs");
                            } else {
                              setoutput("Erreur lors du chargement de la coopérative. Vérifiez votre connexion.")
                              Snackbar.show({
                                text: "Erreur lors du chargement de la coopérative. Vérifiez votre connexion.",
                                duration: Snackbar.LENGTH_LONG,
                                backgroundColor: Colors.dangerColor
                              });
                            }
                          } else {
                            setoutput("Erreur de connexion lors du chargement de la coopérative.")
                            Snackbar.show({
                              text: "Erreur de connexion lors du chargement de la coopérative.",
                              duration: Snackbar.LENGTH_LONG,
                              backgroundColor: Colors.dangerColor
                            });
                          }
                        })
                      } else {
                        // Livreur - no cooperative needed, go directly to livreur home
                        navigation.replace(routes['homelivreur']);
                      }
                    } else {
                      setisloading(false);
                      setoutput("Erreur lors de l'enregistrement de la session locale.")
                      Snackbar.show({
                        text: "Erreur lors de l'enregistrement de la session locale.",
                        duration: Snackbar.LENGTH_INDEFINITE,
                        backgroundColor: Colors.dangerColor
                      });
                    }
                  })
                  })
                  break;
                case 403:
                  setoutput("Le mot de passe ou le nom d'utilisateur est incorrect")
                  Snackbar.show({
                    text: "Le mot de passe ou le nom d'utilisateur est incorrect",
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: Colors.dangerColor
                  });
                  break;
                case 402:
                  setoutput("Votre compte n'est pas encore activé")
                  ref.current.confirm({
                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Vérification compte</Text>,
                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Votre compte n'est pas encore activé, voulez-vous activer le compte</Text>],
                    ok: {
                      text: 'Vérifier le compte',
                      style: {
                        color: Colors.primaryColor,
                        fontFamily: 'mons'
                      },
                      callback: () => navigation.replace("verifyaccount", { item: done['data'] })
                    },
                    cancel: {
                      text: 'Annuler',
                      style: {
                        color: Colors.darkColor,
                        fontFamily: "mons-e"
                      }
                    },
                  })
                  Snackbar.show({
                    text: "Compte non activé",
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: Colors.dangerColor
                  });
                  break;
                default:
                  setoutput("Une erreur inconnue vient de se produire !")
                  Snackbar.show({
                    text: "Une erreur inconnue vient de se produit !",
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: Colors.dangerColor
                  });
                  break;
              }
            } else {
              setisloading(false)
              setoutput("Erreur de connexion au serveur. Vérifiez votre connexion internet.")
              Snackbar.show({
                text: "Erreur de connexion au serveur. Vérifiez votre connexion internet.",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Colors.dangerColor
              });
            }
          })
        } catch (error) {
          setisloading(false)
          setoutput("Une erreur inattendue s'est produite.")
          Snackbar.show({
            text: "Une erreur inattendue s'est produite.",
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: Colors.dangerColor
          });
        }
      } else {
        Snackbar.show({
          text: "Entrez votre mot de passe de connexion !",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: Colors.dangerColor
        });
      }
    } else {
      Snackbar.show({
        text: "Entrez votre numéro de téléphone ou l'adresse mail",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Colors.dangerColor
      });
    }
  };

  return (
    <>
      <View style={[screenContainer, { backgroundColor: Colors.primary[500] }]}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: isDesktop ? 80 : 60,
            backgroundColor: Colors.primary[500],
            paddingHorizontal: isDesktop ? 32 : 16,
            minHeight: height - (isDesktop ? 80 : 60), // Ensure scrollability on short viewports
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl
            colors={[Colors.primary[500]]}
            refreshing={isloading}
            onRefresh={() => {}}
          />}
        >
          <View style={{ width: formMaxWidth, alignSelf: 'center', marginTop: isDesktop ? 80 : 32, marginBottom: isDesktop ? 60 : 40 }}>
            {/* Logo/Brand Section */}
            <View style={{ ...flexColCenter, marginBottom: 40, gap: 12 }}>
              <View style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                backgroundColor: Colors.whiteColor,
                ...flexRowCenter,
                ...Shadows.shadow.lg,
                marginBottom: 8,
              }}>
                <Ionicons name="leaf" size={44} color={Colors.primary[500]} />
              </View>
              <Text style={{
                ...text.h2,
                color: Colors.whiteColor,
                fontWeight: '700',
                letterSpacing: -0.5,
                textAlign: 'center',
                maxWidth: '100%',
              }}>
                HewAgri POS
              </Text>
              <Text style={{
                ...text.bodyMedium,
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                maxWidth: '100%',
                lineHeight: 22,
              }}>
                Connectez-vous à votre espace
              </Text>
            </View>

            {/* Login Form Card */}
            <View style={[cardElevated, { padding: isDesktop ? 32 : 24, backgroundColor: Colors.whiteColor, borderRadius: isDesktop ? 16 : 12 }]}>
              {String(output).length > 0 && (
                <View style={{
                  backgroundColor: Colors.dInRGBA,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 16,
                  borderLeftWidth: 3,
                  borderLeftColor: Colors.danger.main,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 8,
                }}>
                  <Ionicons name="alert-circle-outline" size={20} color={Colors.danger.main} style={{ marginTop: 2 }} />
                  <Text style={{ ...text.bodySmall, color: Colors.danger.main, flex: 1 }}>
                    {output}
                  </Text>
                </View>
              )}

              {/* Email/Phone Field */}
              <View style={fieldGroup}>
                <Text style={inputLabel}>Adresse email ou téléphone</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.neutral[50], borderRadius: 8, borderWidth: 1, borderColor: Colors.border.main }}>
                  <View style={{ paddingHorizontal: 16, borderRightWidth: 1, borderRightColor: Colors.border.light, justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome5 name="envelope" size={20} color={Colors.primary[500]} />
                  </View>
                  <TextInput
                    placeholder="ex: user@domaine.com ou +243xxxxxxxxx"
                    value={num}
                    maxLength={50}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    onChangeText={(t) => setnum(t)}
                    style={{
                      ...input,
                      flex: 1,
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                    }}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={fieldGroup}>
                <Text style={inputLabel}>Mot de passe</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.neutral[50], borderRadius: 8, borderWidth: 1, borderColor: Colors.border.main }}>
                  <View style={{ paddingHorizontal: 16, borderRightWidth: 1, borderRightColor: Colors.border.light, justifyContent: 'center', alignItems: 'center' }}>
                    <Entypo name="lock" size={20} color={Colors.primary[500]} />
                  </View>
                  <TextInput
                    placeholder="••••••••"
                    value={password}
                    secureTextEntry={eye}
                    autoComplete="current-password"
                    onChangeText={(t) => setpassword(t)}
                    style={{
                      ...input,
                      flex: 1,
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                    }}
                  />
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={() => seteye(!eye)}
                    style={{ paddingHorizontal: 16, paddingVertical: 14 }}
                  >
                    <Ionicons name={eye ? "eye-off-outline" : "eye-outline"} size={22} color={Colors.text.tertiary} />
                  </TouchableHighlight>
                </View>
              </View>

              {/* Submit Button */}
              <View style={{ marginTop: 12 }}>
                <TouchableHighlight
                  onPress={onSubmit}
                  disabled={isloading}
                  underlayColor={Colors.primary[600]}
                  style={[btnPrimaryLg, { minHeight: 56, borderRadius: isDesktop ? 10 : 8, ...(isDesktop ? Shadows.shadow.md : {}) }]}
                  activeOpacity={0.9}
                >
                  {isloading ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Spinner size="small" color={Colors.whiteColor} />
                      <Text style={{ ...text.buttonLarge, color: Colors.whiteColor }}>Connexion en cours...</Text>
                    </View>
                  ) : (
                    <Text style={{ ...text.buttonLarge, color: Colors.whiteColor }}>Se connecter</Text>
                  )}
                </TouchableHighlight>
              </View>
            </View>

            {/* Divider with "OR" */}
            <View style={{ ...flexRowCenter, marginVertical: 28, gap: 16 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
              <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20 }}>
                <Text style={{ ...text.labelSmall, color: Colors.whiteColor, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: '600' }}>Ou</Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
            </View>

            {/* Secondary Actions */}
            <View style={{ gap: 10, marginTop: 4 }}>
              <TouchableHighlight
                underlayColor={Colors.neutral[200]}
                onPress={() => navigation.navigate(routes['auth'])}
                style={[btnGhostLg, { backgroundColor: Colors.whiteColor, borderWidth: 1.5, borderColor: Colors.primary[500], minHeight: 52, borderRadius: isDesktop ? 10 : 8 }]}
                activeOpacity={0.9}
              >
                <Text style={{ ...text.buttonLarge, color: Colors.primary[500], fontWeight: '600' }}>Créer un compte</Text>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor={Colors.neutral[200]}
                onPress={() => navigation.navigate("verifyaccount")}
                style={[btnGhostLg, { backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', minHeight: 52, borderRadius: isDesktop ? 10 : 8 }]}
                activeOpacity={0.9}
              >
                <Text style={{ ...text.buttonLarge, color: Colors.whiteColor, fontWeight: '600' }}>Vérifier mon compte</Text>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor={Colors.neutral[200]}
                onPress={() => navigation.navigate("forgotpassword")}
                style={[btnGhostLg, { backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', minHeight: 52, borderRadius: isDesktop ? 10 : 8 }]}
                activeOpacity={0.9}
              >
                <Text style={{ ...text.buttonLarge, color: Colors.whiteColor, fontWeight: '600' }}>Mot de passe oublié</Text>
              </TouchableHighlight>
            </View>

            {/* Footer info */}
            <View style={{ marginTop: 40, paddingTop: 28, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', gap: 8 }}>
              <Text style={{ ...text.caption, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 20 }}>
                HewAgri POS - Gestion coopérative agricole
              </Text>
              <Text style={{ ...text.caption, color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 20 }}>
                Version 1.0.0
              </Text>
            </View>
          </View>
        </ScrollView>
        <Footer />
      </View>
      <DialogBox ref={ref} isOverlayClickClose={false} />
    </>
  )
}

