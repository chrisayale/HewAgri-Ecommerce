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

export const DetailsApproviionnement = ({ navigation, route }) => {
    const { params } = route;
    const { item } = params;
    const { createdAt, description, transaction, updatedAt, __tbl_ecom_cooperative, __tbl_ecom_produits } = item;

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

        PosPrinter.connectDevice(`ZCSPrint-66:11:22:33:44:55` || device.identifier)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    };

    const confirmAndPrint = async () => {
        return new Promise((resolve, reject) => {
            try {
                PosPrinter.connectDevice(`IposPrinter-00:AA:11:BB:22:CC`)//ZCSPrint-66:11:22:33:44:55
                    .then((res) => {
                        let current_item = JSON.stringify(item)
                        // console.log('====================================');
                        // console.log("Item is ==> ", item);
                        // console.log('====================================');
                        PosPrinter.printTestReceipt(JSON.stringify(item))
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
        console.log('====================================');
        console.log(item);
        console.log('====================================');
    }, []);

    return (
        <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }} >
            <Title title={`Approvionnement ID: ${transaction}`} subtitle={"Détails approvisionnement"} navigation={navigation} />
            <>
                <View style={{ width: "100%", flexDirection: "row", alignContent: "center", alignItems: "center", alignSelf: "center", justifyContent: "center", overflow: "hidden", borderRadius: 10, padding: 5, backgroundColor: Colors.pillColor }}>
                    <View style={{ width: "90%" }}>
                        <View style={{ flexDirection: "column", padding: 10, backgroundColor: Colors.pillColor }}>
                            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                                <View style={{ width: "50%" }}>
                                    <Text style={{ color: Colors.darkColor, fontFamily: "mons-e" }}>ID Transaction</Text>
                                    <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{transaction}</Text>
                                </View>
                                <View style={{ width: "50%" }}>
                                    <Text style={{ color: Colors.darkColor, fontFamily: "mons-e" }}>Date d'approvisionnement</Text>
                                    <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{formatDate({ date: createdAt })}</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-e" }}>Produits approvionnés ( {Array.from(__tbl_ecom_produits).length} )</Text>
                                <View>
                                    {Array.from(__tbl_ecom_produits).map((prd, index) => {
                                        const { produit, __tbl_ecom_hasproducts, __tbl_ecom_unitesmesures } = prd;
                                        const { unity } = __tbl_ecom_unitesmesures;
                                        const { qte, prix_unitaire, currency } = __tbl_ecom_hasproducts
                                        return (
                                            <View style={{}} key={index}>
                                                <Text style={{ fontFamily: "mons" }}>{produit} | Qte. :{qte}{unity} | Prix :{prix_unitaire}{currency} </Text>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ width: "85%", height: 65, flexDirection: "column", marginVertical: 25, alignItems: "center", alignSelf: "center", marginTop: 50 }}>
                    <TouchableHighlight
                        onPress={() => {
                            __handlePrint()
                        }}
                        disabled={Object.keys(__tbl_ecom_produits).length <= 0}
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