import * as React from 'react';
import { StatusBar, View, Text, Animated, TouchableHighlight, Modal, TextInput, Keyboard, ScrollView, RefreshControl, Platform } from 'react-native';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { AntDesign, Entypo, Ionicons, Feather, MaterialIcons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import DialogBox from 'react-native-dialogbox';
import { routes } from '../../assets/helper/helper.routes';
import Snackbar from 'react-native-snackbar';
import { onRunExternalRQST } from '../../services/communications';
import { btnHeader, btnHome, Colors } from '../../assets/styles/Styles';
import { StoreAsRegisterComponent } from '../../components/Store/Storeregister';
import { Tooltip } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

export const HomeScreen = ({ navigation }) => {

  const ref = React.useRef(null);
  const [inf, setinf] = React.useState({});
  const [isloading, setisloading] = React.useState(false)
  const tooltipRef = React.useRef(null);
  const { num_enregistrement, phone, sigle, cooperative, adresse, __tbl_ecom_users = [], id: idcooperative } = global.coopec || {}

  const __ = async () => {
    setisloading(true)
    onRunExternalRQST({
      method: "GET",
      url: `/cooperatives/cooperative/${idcooperative}`
    }, (err, done) => {
      setisloading(false)
      console.log('[HomeScreen] Cooperative fetch response:', { err, done });
      if (done) {
        const { status, message, data } = done;
        if (status === 200) {
          global.coopec = data;
          const { num_enregistrement: newNumEnregistrement, phone: newPhone, sigle: newSigle, cooperative: newCooperative, adresse: newAdresse, __tbl_ecom_users: newUsers = [] } = data || {};
          setinf({
            ...(global['user'] || {}),
            num_enregistrement: newNumEnregistrement ?? num_enregistrement,
            phone: newPhone ?? phone,
            sigle: newSigle ?? sigle,
            cooperative: newCooperative ?? cooperative,
            adresse: newAdresse ?? adresse,
            nombre_membres: Array.from(newUsers).length
          })
        } else {
          Snackbar.show({
            text: message || "Une erreur est survenue lors de traitement des informations !",
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: Colors.dangerColor
          });
        }
      } else {
        console.error('[HomeScreen] Cooperative fetch failed:', err);
        Snackbar.show({
          text: "Impossible de charger les données de la coopérative. Vérifiez votre connexion.",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: Colors.dangerColor
        });
      }
    })
  }

  React.useEffect(() => {
    __()
  }, [])

  const renderIcon = (item) => {
    const IconComponent = {
      MaterialCommunityIcons,
      Entypo,
      Feather,
      AntDesign,
      Ionicons,
      MaterialIcons,
      FontAwesome6,
    }[item.iconLib] || MaterialCommunityIcons;
    return <IconComponent name={item.icon} size={Dims.iconsize * 1.5} color={Colors.primaryColor} />;
  };

  // Menu items matching original design
  const menuItems = [
    { id: 'bonentree', label: 'Approvisionnement', icon: 'store-plus', iconLib: 'MaterialCommunityIcons', route: routes['bonentree'] },
    { id: 'credit', label: 'Demande de crédit', icon: 'credit', iconLib: 'Entypo', route: routes['credit'] },
    { id: 'addmember', label: 'Ajouter un membre', icon: 'user-plus', iconLib: 'Feather', route: routes['addmember'] },
    { id: 'members', label: 'Liste des membres', icon: 'users', iconLib: 'Feather', route: routes['members'] },
    { id: 'storage', label: 'Stock disponible', icon: 'store', iconLib: 'MaterialCommunityIcons', route: routes['storage'] },
    { id: 'commandes', label: 'Toutes les commandes', icon: 'cart-arrow-down', iconLib: 'MaterialCommunityIcons', route: routes['commandes'] },
    { id: 'storagefinished', label: 'Stock écoulé', icon: 'store-check', iconLib: 'MaterialCommunityIcons', route: routes['storagefinished'] },
    { id: 'commandesdone', label: 'Commandes effectuées', icon: 'cart-arrow-up', iconLib: 'MaterialCommunityIcons', route: routes['commandesdone'] },
    { id: 'listecredits', label: 'Liste demandes de crédits', icon: 'credit', iconLib: 'Entypo', route: routes['listecredits'] },
    { id: 'historiques', label: 'Historiques', icon: 'store-check', iconLib: 'MaterialCommunityIcons', route: routes['historiques'] },
    { id: 'storagestate', label: 'État de stock', icon: 'store-check', iconLib: 'MaterialCommunityIcons', route: routes['storagestate'] },
    { id: 'aboutcoop', label: 'À propos', icon: 'information', iconLib: 'MaterialCommunityIcons', route: routes['aboutcoop'] },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryColor} />
      <View style={{ paddingBottom: 0, backgroundColor: Colors.primaryColor, width: "100%" }}>
        <View style={{ minHeight: 120, paddingBottom: 20 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "60%", padding: 12, height: "auto" }}>
              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => navigation.navigate(routes['aboutcoop'])}
              >
                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                  <Text style={{ fontSize: 18, color: Colors.whiteColor, fontFamily: "mons", textTransform: "capitalize" }}>
                    {inf && inf['cooperative'] ? String(inf['cooperative']) : '---'}
                  </Text>
                </View>
              </TouchableHighlight>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="call" color={Colors.whiteColor} style={{ paddingRight: 7 }} />
                <Text style={{ color: Colors.whiteColor, fontFamily: "mons-e", fontSize: 11 }}>
                  {inf && inf['phone'] ? String(inf['phone']) : ''}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="email" color={Colors.whiteColor} style={{ paddingRight: 7 }} />
                <Text style={{ color: Colors.whiteColor, fontFamily: "mons-e", fontSize: 11 }}>
                  {inf && inf['email'] ? String(inf['email']) : ''}
                </Text>
              </View>
            </View>
            <View style={{ width: "40%", padding: 8, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
              <TouchableHighlight
                underlayColor={Colors.primaryColor}
                style={[btnHeader, { minWidth: 56, height: 56, justifyContent: "center", alignItems: "center" }]}
                onPress={() => navigation.navigate(routes['storagestate'])}
              >
                <MaterialCommunityIcons name="store-check" size={28} color={Colors.whiteColor} />
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={Colors.primaryColor}
                style={[btnHeader, { minWidth: 56, height: 56, justifyContent: "center", alignItems: "center" }]}
                onPress={__}
              >
                <Ionicons name="refresh-circle" size={28} color={Colors.whiteColor} />
              </TouchableHighlight>
            </View>
          </View>
          <View>
            <View style={{ width: "95%", alignSelf: "center", borderTopColor: Colors.pillColor, borderTopWidth: .6, flexDirection: "row" }}>
              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => navigation.navigate(routes['members'])}
                style={{ width: "50%", paddingHorizontal: 5, marginTop: 6 }}
              >
                <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                  <View style={{ marginTop: 10, alignContent: "center" }}>
                    <Text style={{ fontFamily: "mons-e", color: Colors.pillColor, textAlign: "center" }}>Nombre membres</Text>
                    <Text style={{ fontFamily: "mons", color: Colors.pillColor, textAlign: "center" }}>
                      {inf && inf['nombre_membres'] ? String(inf['nombre_membres']).concat(" Membre ( s ) ") : '0 Membre ( s )'}
                    </Text>
                  </View>
                  <MaterialIcons name="arrow-drop-down" size={24} color={Colors.whiteColor} />
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => navigation.navigate(routes['profile'])}
                style={{ width: "50%", paddingHorizontal: 5, marginTop: 6, borderLeftWidth: .6, borderLeftColor: Colors.pillColor }}
              >
                <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontFamily: "mons-e", color: Colors.pillColor, textAlign: "center" }}>Administrateur</Text>
                    <Text style={{ fontFamily: "mons", color: Colors.whiteColor, textAlign: "center" }}>
                      {inf && inf['nom'] ? String(inf['nom']).concat(" ").concat(String(inf['postnom'] || '')) : '---'}
                    </Text>
                  </View>
                  <MaterialIcons name="arrow-drop-down" size={24} color={Colors.whiteColor} />
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
      <View style={{ backgroundColor: Colors.neutreColor, flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: "30%" }}
          refreshControl={<RefreshControl
            colors={[Colors.primaryColor]}
            refreshing={isloading}
            onRefresh={__}
          />}
        >
          <View style={{ marginTop: 10, width: "100%" }}>
            {menuItems.map((item, index) => {
              const isFirstInRow = index % 2 === 0;
              const isLastInRow = index % 2 === 1;
              const isLastItem = index === menuItems.length - 1;

              if (isFirstInRow) {
                return (
                  <View key={`row-${index}`} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10, marginBottom: 15 }}>
                    <View style={{ width: "50%", paddingHorizontal: 5 }}>
                      <TouchableHighlight
                        style={[btnHome]}
                        underlayColor={Colors.pillColor}
                        onPress={() => navigation.navigate(item.route)}
                      >
                        <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                          <View style={{ borderColor: Colors.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                            {renderIcon(item)}
                          </View>
                          <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Colors.primaryColor }}>{item.label}</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                    {isLastItem ? null : (
                      <View style={{ width: "50%", paddingHorizontal: 5 }}>
                        <TouchableHighlight
                          style={[btnHome]}
                          underlayColor={Colors.pillColor}
                          onPress={() => navigation.navigate(menuItems[index + 1].route)}
                        >
                          <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                            <View style={{ borderColor: Colors.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                              {renderIcon(menuItems[index + 1])}
                            </View>
                            <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Colors.primaryColor }}>{menuItems[index + 1].label}</Text>
                          </View>
                        </TouchableHighlight>
                      </View>
                    )}
                  </View>
                );
              }
              return null;
            })}
          </View>
          {isloading && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
              <Spinner color={Colors.primaryColor} size="large" />
              <Text style={{ color: Colors.textColor, fontFamily: "mons-e", marginTop: 10 }}>Chargement...</Text>
            </View>
          )}
        </ScrollView>
      </View>
      <DialogBox ref={ref} isOverlayClickClose={false} />
    </>
  )
}