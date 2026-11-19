import * as React from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, StatusBar, ActivityIndicator } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import DialogBox from 'react-native-dialogbox';
import { AntDesign, Entypo, Ionicons, Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Title } from '../../components/Title/Title';
import { Colors } from '../../assets/colors/Colors';
import { Footer } from '../../components/Footer/comp.footer';
import { Dims } from '../../assets/dimensions/Dimemensions';

NfcManager.start();

export const NfcreaderScreen = ({ navigation, route }) => {
  const [tag, settag] = React.useState(null);
  const [onwait, setonwait] = React.useState(false);
  const dialogbox = React.useRef(null);
  const Consts = Colors;

  async function readNdef() {
    setonwait(true)
    settag(null)
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      // const tag = await NfcManager.getTag();
      // settag(tag);
      NfcManager.ndefHandler.getNdefMessage()
        .then(e => {

          // NfcTech.Ndef.uri.decodePayload(e['ndefMessage'][0]['payload']);
          // settag();
          const tag = (Ndef.uri.decodePayload(e['ndefMessage'][0]['payload'])).toString() || ""
          navigation.navigate("search", { keyword: tag })
        })
        .catch(err => {
          dialogbox.current.confirm({
            title: <Text style={{ fontFamily: "mons", fontSize: 14, color: Colors.dangerColor }}>Erreur de lecture | RFID</Text>,
            content: [<Text style={{ fontFamily: "mons", fontSize: 13 }} >Une erreur vient de se produire lors de la lecture de la carte. Veuillez rapprocher la carte RFID tout prêt de l'appareil</Text>],
            ok: {
              text: "Reessayer",
              style: {
                fontFamily: "mons-b",
                color: Consts.primaryColor
              },
              callback: readNdef
            },
            cancel: {
              text: "Annuler",
              style: {
                fontFamily: "mons-e",
                color: Consts.darkColor
              }
            }
          })
        })


      setonwait(false);
      setTimeout(() => {
        if (onwait) {
          settag(null)
          setonwait(false)
          NfcManager.cancelTechnologyRequest();
        }
      }, 5000)

    } catch (ex) {
      setonwait(false)
      // console.warn('Oops!', ex);
      dialogbox.current.confirm({
        title: <Text style={{ fontFamily: "mons", fontSize: 14, color: Colors.dangerColor }}>Erreur de lecture | RFID</Text>,
        content: [<Text style={{ fontFamily: "mons", fontSize: 13 }} >Une erreur vient de se produire lors de la lecture de la carte. Veuillez rapprocher la carte RFID tout prêt de l'appareil</Text>],
        ok: {
          text: "Reessayer",
          style: {
            fontFamily: "mons-b",
            color: Consts.primaryColor
          },
          callback: readNdef
        },
        cancel: {
          text: "Annuler",
          style: {
            fontFamily: "mons-e",
            color: Consts.darkColor
          }
        }
      })
    } finally {
      // stop the nfc scanning
      setonwait(false)
      NfcManager.cancelTechnologyRequest();
    }
  }

  React.useEffect(() => {
    // readNdef()
  }, []);

  return (
    <>
      <StatusBar backgroundColor={Consts.primaryColor} barStyle='light-content' />
      <Title title={"Lecteur NFC"} subtitle={"Lecture des informations du permis"} navigation={navigation} />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* <View style={{ width: 270, alignSelf: "center", marginVertical: 20, display: tag ? "flex" : "none" }}>
          <Text style={{ textAlign: "center" }}>
            {JSON.stringify(tag)}
          </Text>
        </View> */}
        <>
          <View style={{ marginTop: 45, width: 250, alignSelf: "center", marginBottom: 20, display: onwait ? "flex" : "none" }}>
            <Text style={{ textAlign: "center", color: Consts.darkColor, fontFamily: "mons" }}>
              Pour scanner rapprocher la carte au POS pour continuer ...
            </Text>
            <Text style={{ textAlign: "center", paddingTop: 12, fontFamily: "mons-e" }}>
              La carte doit se rapprocher de l'appareil de moins de 5 cm, pour commencer de la carte
            </Text>
            {/* <ActivityIndicator size={100} color={Consts.primaryColor} /> */}
          </View>
          <View>
            {onwait
              ?
              <View
                style={{
                  width: 200,
                  height: 200,
                  position: "absolute",
                  justifyContent: "center",
                  alignSelf: "center",

                }}
              >
                <ActivityIndicator size={200} color={Consts.primaryColor} style={{}} />
              </View>
              :
              <>
                <View>
                  <View style={{ marginTop: 45, width: 250, alignSelf: "center", marginBottom: 20}}>
                    <Text style={{ textAlign: "center", color: Consts.darkColor, fontFamily: "mons" }}>
                      Cliquer pour lire
                    </Text>
                    <Text style={{ textAlign: "center", paddingTop: 12, fontFamily: "mons-e" }}>
                      La carte doit se rapprocher de l'appareil de moins de 5 cm, pour commencer de la carte
                    </Text>
                    {/* <ActivityIndicator size={100} color={Consts.primaryColor} /> */}
                  </View>
                </View>
              </>
            }
            <TouchableHighlight
              style={{ borderRadius: 100, width: 200, height: 200, alignSelf: "center", alignContent: "center", alignItems: "center", justifyContent: "center" }}
              underlayColor={"transparent"}
              onPress={readNdef}>
              <>
                {/* <Ionicons name='radio-outline' color={Consts.primaryColor} size={50} style={{alignSelf: "center"}} /> */}
                <MaterialCommunityIcons name="nfc" size={Dims.iconsize * 2.5} color={Consts.primaryColor} />
                {/* <Text style={{color: Consts.dark, fontSize: 12, textAlign: "center"}} ></Text> */}
              </>
            </TouchableHighlight>
          </View>
        </>
      </View>
      <Footer />
      <DialogBox ref={dialogbox} />
    </>
  );
}

