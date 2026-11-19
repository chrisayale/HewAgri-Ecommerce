import * as React from 'react'
import { Text, TouchableHighlight, View, PermissionsAndroid, Platform } from 'react-native'
import { Title } from '../../components/Title/Title'
import { Colors } from '../../assets/colors/Colors'
import { Divider } from 'react-native-elements'
import { Dims } from '../../assets/dimensions/Dimemensions'
import { formatDate } from '../../assets/helper/helper.all'
import { btn } from '../../assets/styles/Styles'
import { Footer } from '../../components/Footer/comp.footer'
import PosPrinter from 'react-native-pos-printer';
import RNFetchBlob from 'rn-fetch-blob';
import Snackbar from 'react-native-snackbar'
import { appname } from '../../assets/configs/configs'
import BleManager from 'react-native-ble-manager';

export const DetailsApproviionnementParMembre = ({ navigation, route }) => {
    const { params } = route;
    const { item } = params;
    const { transaction, __tbl_ecom_produit, __tbl_ecom_unitesmesure, membre, __tbl_ecom_category, __tbl_ecom_user, createdAt, __tbl_ecom_cooperative, __tbl_ecom_produits, date_production, qte, updatedAt } = item
    const { produit } = __tbl_ecom_produit;
    const { nom, postnom, prenom, phone, email } = __tbl_ecom_user
    const { category } = __tbl_ecom_category
    const { unity } = __tbl_ecom_unitesmesure
    const { adresse, phone: as_phone_cooperative, num_enregistrement } = __tbl_ecom_cooperative

    const [devices, setDevices] = React.useState([]);

    const requestBluetoothPermission = async () => {
        return new Promise(async (resolve, reject) => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Permission Localisation',
                            message: `${appname} a besoin d\'accéder à votre emplacement pour utiliser le Bluetooth.`,
                            buttonNeutral: 'Demander plus tard',
                            buttonNegative: 'Annuler',
                            buttonPositive: 'OK',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log('Permission accordée');
                        BleManager.enableBluetooth().then(() => {
                            console.log('Bluetooth activé');
                            resolve(granted)
                        }).catch((error) => {
                            console.log('Erreur lors de l\'activation du Bluetooth:', error);
                            reject(error)
                        });
                    } else {
                        console.log('Permission refusée');
                        reject('Permission refusée')
                    }
                } catch (err) {
                    console.warn(err);
                    reject('Permission refusée')
                }
            }
        })
    };

    const getDevices = () => {
        // console.log('getDevices');

        PosPrinter.getDevices()
            .then((device) => {
                console.log('====================================');
                console.log(device);
                console.log('====================================');
                setDevices(device)
            })
            .catch((err) => console.log(err));
    };

    const connectDevice = (device) => {
        console.log('connectDevice', device);

        PosPrinter.connectDevice(`IposPrinter-00:AA:11:BB:22:CC` || device.identifier)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    };

    const confirmAndPrint = async () => {
        return new Promise((resolve, reject) => {
            try {
                PosPrinter.connectDevice(`IposPrinter-00:AA:11:BB:22:CC`)//ZCSPrint-66:11:22:33:44:55
                    .then((res) => {
                        item['out-singgle-product'] = true;
                        let current_item = JSON.stringify(item)
                        // console.log('====================================');
                        // console.log("Item is ==> ", current_item);
                        // console.log('====================================');
                        PosPrinter.printTestReceipt(current_item)
                            .then((res) => resolve("Printer MACADDRESSE: `IposPrinter-00:AA:11:BB:22:CC`"))
                            .catch((err) => reject(err));
                    })
                    .catch((err) => {
                        console.log('====================================');
                        console.log(err);
                        console.log('====================================');
                        return reject(err)
                    });
            } catch (e) {
                console.log(e);
                return reject(e)
            }
        })
    };

    React.useEffect(() => {
        PosPrinter.init(false)
            .then((res) => {
                // getDevices()
                // console.log('====================================');
                // console.log(PosPrinter.isDebug(true));
                // console.log('====================================');
                // ()
            })
            .catch((err) => console.log(err));
    });

    const __handlePrint = async () => {
        requestBluetoothPermission()
            .then(b => {
                confirmAndPrint()
                    .then(Y => {
                        Snackbar.show({
                            text: `${appname} a réussi à imprimer votre document !`,
                            duration: Snackbar.LENGTH_LONG,
                            backgroundColor: Colors.primaryColor
                        });
                    })
                    .catch(E => {
                        Snackbar.show({
                            text: `${appname} n'arrive pas à imprimer votre document !`,
                            duration: Snackbar.LENGTH_LONG,
                            backgroundColor: Colors.dangerColor
                        });
                    })
            })
            .catch(err => {
                Snackbar.show({
                    text: `Vous devez permettre à ${appname} à accéder à votre comp`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Colors.dangerColor
                });
            })
    }

    React.useEffect(() => {

    }, []);

    return (
        <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }} >
            <Title title={`Approvionnement de ${nom}`} subtitle={`Détails approvisionnement ${produit}`} navigation={navigation} />
            <>
                <View style={{ width: "100%", flexDirection: "row", alignContent: "center", alignItems: "center", alignSelf: "center", justifyContent: "center", overflow: "hidden", borderRadius: 10, padding: 5, backgroundColor: Colors.pillColor }}>
                    <View style={{ width: "90%", marginVertical: 20 }}>
                        <View style={{ flexDirection: "column", width: "100%", justifyContent: "space-between" }}>
                            <View style={{ width: "100%" }}>
                                <Text style={{ color: Colors.darkColor, fontFamily: "mons-e" }}>Nom du membre</Text>
                                <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{membre}</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: 20 }}>
                                <Text style={{ color: Colors.darkColor, fontFamily: "mons-e" }}>Téléphone du membre</Text>
                                <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{phone}</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: 20 }}>
                                <Text style={{ color: Colors.darkColor, fontFamily: "mons-e" }}>Date d'approvisionnement</Text>
                                <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{formatDate({ date: createdAt })}</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: 20 }}>
                                <Text style={{ color: Colors.darkColor, fontFamily: "mons-e" }}>Catégorie produit</Text>
                                <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{category}</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: 20 }}>
                                <Text style={{ color: Colors.darkColor, fontFamily: "mons-e" }}>Produits approvisionnés (1)</Text>
                                <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{produit}</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: 20 }}>
                                <Text style={{ color: Colors.darkColor, fontFamily: "mons-e" }}>Quantité d'approvisionnement ({unity})</Text>
                                <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{qte} {unity}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ width: "85%", height: 65, flexDirection: "column", marginVertical: 25, alignItems: "center", alignSelf: "center", marginTop: 10 }}>
                    <TouchableHighlight
                        onPress={() => {
                            __handlePrint()
                        }}
                        // disabled={Object.keys(__tbl_ecom_produits).length <= 0}
                        underlayColor={Colors.primaryColor}
                        style={[btn, {}]}
                    >
                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Imprimer un reçu</Text>
                    </TouchableHighlight>
                </View>
            </>
            <Footer />
        </View>
    )
}