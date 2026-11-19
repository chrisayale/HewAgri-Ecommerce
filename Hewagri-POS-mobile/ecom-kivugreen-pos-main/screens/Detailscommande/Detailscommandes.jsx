import * as React from 'react'
import { Title } from '../../components/Title/Title'
import { FlatList, ScrollView, Text, Touchable, View, PermissionsAndroid } from 'react-native';
import { Divider } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { encodeBase64, formatDate, renderState, trucString } from '../../assets/helper/helper.all';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { TouchableHighlight } from 'react-native';
import { btn, cel } from '../../assets/styles/Styles';
import { StyleSheet } from 'react-native';
import Snackbar from 'react-native-snackbar';
import BleManager from 'react-native-ble-manager';
import PosPrinter from 'react-native-pos-printer';
import { appname, appnamecompangyname, endpoint } from '../../assets/configs/configs';
import { onRunExternalRQST } from '../../services/communications';
import Netinfo from '@react-native-community/netinfo';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from "react-native-modal";
import QRCode from 'react-native-qrcode-svg';
import { io } from 'socket.io-client';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell
} from 'react-native-confirmation-code-field';

export const DetailscommandeScreen = ({ navigation, route }) => {

    const { item, group: asgroup, id_transaction } = route['params'];
    const { __tbl_ecom_user, __tbl_ecom_typelivraison, state, transaction, createdAt } = item;
    const { nom, postnom, prenom, phone, email, sexe, id } = __tbl_ecom_user; // as customer
    const { type, frais_livraison } = __tbl_ecom_typelivraison;
    const { coopec } = global;
    const [isloading, setisloading] = React.useState(false);
    const [asstate, setasstate] = React.useState(state);
    const { name, color } = renderState({ state: asstate });
    const [group, setgroup] = React.useState([]);
    const [show, setshow] = React.useState(false);
    const [showc, setshowc] = React.useState(false);
    const [value, setValue] = React.useState('');
    const [codes, setcodes] = React.useState({});

    // const logoFromFile = require('../../assets/images/hewagri-logo.png');
    const CELL_COUNT = 6

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const { idcooperative, user, token } = global;
    const { typeaccount, realid } = user;
    let socket;

    const socketConnection = () => {
        socket = io(endpoint, {
            transports: ['websocket'],
            jsonp: false,
            reconnection: false,
            reconnectionAttempts: 5,
            reconnectionDelay: 700,
            reconnectionDelayMax: 700,
            timeout: 2000,
            autoConnect: true
        });

        socket.on('connect', () => {
            console.log('Connected to server');
            Snackbar.show({
                numberOfLines: 5,
                text: "Le socket a été mis en place avec succès !",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Colors.successColor
            });
        });

        socket.on("pairingdone", (e) => {
            console.log("Done pairing ==> ", e);
        })

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            Snackbar.show({
                numberOfLines: 5,
                text: "le WebSocket a été deconnecté ",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Colors.dangerColor
            });
        });

        socket.io.on("error", (error) => {
            console.log("Error on connection to socket ===> ", error);
            Snackbar.show({
                numberOfLines: 5,
                text: error.message,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Colors.dangerColor
            });
        });
    };

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

    const confirmAndPrint = async () => {
        return new Promise((resolve, reject) => {
            try {
                PosPrinter.connectDevice(`ZCSPrint-66:11:22:33:44:55`)
                    .then((res) => {
                        PosPrinter.printTestReceipt(JSON.stringify({ item: __tbl_ecom_user, coopec, transaction, group, "out-delivery": true }))
                            .then((res) => resolve("Printer MACADDRESSE: `ZCSPrint-66:11:22:33:44:55`"))
                            .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
            } catch (e) {
                console.log(e);
                return reject(e)
            }
        })
    };

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
    };

    const _handleFinishTypingCode = async () => {
        const { code_livraison, id_transaction } = codes
        // setisloading(true)
        if (String(value) == String(code_livraison)) {
            setValue("");
            Netinfo.fetch().then(_ => {
                if (_.isConnected && _.isInternetReachable) {
                    setisloading(true)
                    onRunExternalRQST({
                        method: "PUT",
                        url: `/commandes/commande/validate/${transaction}`,
                        data: {
                            code_livraison,
                            id_livreur: realid,
                            id_transaction: transaction,
                            id_customer: id
                        }
                    }, (err, done) => {
                        setisloading(false)
                        if (done) {
                            const { status, data } = done;
                            if (status === 200) {
                                setshowc(false)
                                __handlePrint()
                                Snackbar.show({
                                    numberOfLines: 6,
                                    text: `La commande a été livré avec succès; `,
                                    duration: Snackbar.LENGTH_LONG,
                                    backgroundColor: Colors.dangerColor
                                });
                            } else {
                                Snackbar.show({
                                    numberOfLines: 6,
                                    text: `Assurez-vous que cet appareil est connecté sur internet avant de continuer`,
                                    duration: Snackbar.LENGTH_LONG,
                                    backgroundColor: Colors.successColor
                                });
                            }
                        } else {
                            Snackbar.show({
                                numberOfLines: 6,
                                text: `Assurez-vous que cet appareil est connecté sur internet avant de continuer`,
                                duration: Snackbar.LENGTH_LONG,
                                backgroundColor: Colors.successColor
                            });
                        }
                    })
                } else {
                    Snackbar.show({
                        numberOfLines: 6,
                        text: `Assurez-vous que cet appareil est connecté sur internet avant de continuer`,
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.successColor
                    });
                }
            })
        } else {
            setValue("")
            Snackbar.show({
                numberOfLines: 6,
                text: `Désolé le code que vous avez entrer est incorrecte`,
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: Colors.dangerColor
            });
        }
    };

    const renderItem = ({ item, index }) => {

        const { transaction, prix_unit, prix_total, qte, currency, payament_phone, state, __tbl_ecom_produit, __tbl_ecom_typelivraison, __tbl_ecom_user, __tbl_ecom_unitesmesure, createdAt } = item;
        const { produit, image, description } = __tbl_ecom_produit;
        const { type, lieux, frais_livraison } = __tbl_ecom_typelivraison;
        const { unity } = __tbl_ecom_unitesmesure;
        const { nom, postnom, prenom, phone, email } = __tbl_ecom_user;
        const { name, color } = renderState({ state })

        return (
            <View style={[styles.item, { flexDirection: "row", width: "100%", justifyContent: "space-between" }]}>
                <View style={{ width: "10%" }}>
                    <Text style={[styles.text, { fontFamily: "mons-e" }]}>{index + 1}</Text>
                </View>
                <View style={{ width: "20%" }}>
                    <Text style={[styles.text, { fontFamily: "mons-e" }]}> {trucString({ nomItem: produit, longueurMax: 3 })}</Text>
                </View>
                <View style={{ width: "20%" }}>
                    <Text style={[styles.text, { fontFamily: "mons-e" }]}>{prix_unit}{currency}</Text>
                </View>
                <View style={{ width: "20%" }}>
                    <Text style={[styles.text, { fontFamily: "mons-e" }]}>X {qte}{unity}</Text>
                </View>
                <View style={{ width: "20%" }}>
                    <Text style={[styles.text, { fontFamily: "mons" }]}>{prix_total}{currency}</Text>
                </View>
            </View>
        )
    };

    const _handleChangeState = async () => {
        // _handleChangeStateForClient()
        setshow(true)
        if (socket) {
            socket.emit("scanned", { ...route['params'] })
        }
    };

    const _handleChangeStateForClient = async () => {
        setshowc(false)
        setValue("");
        Netinfo.fetch().then(is => {
            if (is.isConnected && is.isInternetReachable) {
                setisloading(true)
                onRunExternalRQST({
                    url: `/commandes/commande/beforevalidation/${transaction}`,
                    method: "PUT",
                    data: {
                        id_transaction: transaction,
                        id_livreur: realid,
                        id_customer: id
                    }
                }, (err, done) => {
                    setisloading(false)
                    console.log('====================================');
                    console.log(done, err);
                    console.log('====================================');
                    if (done) {
                        const { status, data } = done;
                        if (status === 200) {
                            // setasstate(2)
                            setcodes(data)
                            setshowc(true)
                            // __handlePrint()
                        } else {
                            Snackbar.show({
                                numberOfLines: 6,
                                text: `Une erreur vient de se produire lors du transfert de la commande ${transaction} à ${appnamecompangyname}, réessayer un peu plus tard`,
                                duration: Snackbar.LENGTH_LONG,
                                backgroundColor: Colors.successColor
                            });
                        }
                    } else {
                        Snackbar.show({
                            numberOfLines: 6,
                            text: `Une erreur vient de se produire lors du transfert de la commande ${transaction} à ${appnamecompangyname}, réessayer un peu plus tard`,
                            duration: Snackbar.LENGTH_LONG,
                            backgroundColor: Colors.successColor
                        });
                    }
                })
            } else {
                Snackbar.show({
                    numberOfLines: 6,
                    text: `Assurez-vous que cet appareil est connecté sur internet avant de continuer`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Colors.successColor
                });
            }
        })
    };

    const Renderbutton = ({ s, ass }) => {
        switch (ass) {
            case 2:
                return (
                    <>
                        <TouchableHighlight
                            underlayColor={Colors.pInRGBA}
                            // disabled={state === 3 ? false : true}
                            style={[btn, { elevation: 5, backgroundColor: asstate === 3 ? Colors.primaryColor : Colors.pillColor }]}
                            onPress={async () => {
                                // alert(asstate)
                                if (asstate === 2 && s === 1) {
                                    // __handlePrint()
                                    await _handleChangeStateForClient()
                                } else {
                                    Snackbar.show({
                                        numberOfLines: 5,
                                        text: "Cette action n'est pas possible sur cette commande car elle n'est pas livrable, S'il s'agit d'une erreur contacter directement le service commercial de Kivugreen ",
                                        duration: Snackbar.LENGTH_SHORT,
                                        backgroundColor: Colors.dangerColor
                                    });
                                }
                            }}
                        >
                            <Text style={{ color: state === 3 ? Colors.whiteColor : Colors.pInRGBA, fontFamily: "mons" }}>Confirmation de la livraison</Text>
                        </TouchableHighlight>
                    </>
                )
                break;
            case 3:
                return (
                    <TouchableHighlight
                        underlayColor={Colors.pInRGBA}
                        // disabled={s === 3 ? false : true}
                        style={[btn, { elevation: 5, backgroundColor: asstate === 3 && s === 2 ? Colors.primaryColor : Colors.pillColor }]}
                        onPress={async () => {
                            if (asstate === 3 && s === 2) { // && s === 2
                                await _handleChangeState()
                            } else {
                                Snackbar.show({
                                    numberOfLines: 5,
                                    text: "Cette action n'est pas possible car vous n'êtes pas connectez avec les autorisations d'une coopérative, S'il s'agit d'une erreur contacter directement le service commercial de " + appnamecompangyname,
                                    duration: Snackbar.LENGTH_SHORT,
                                    backgroundColor: Colors.dangerColor
                                });
                            }
                        }}
                    >
                        <Text style={{ color: state === 3 && s === 2 ? Colors.whiteColor : Colors.pInRGBA, fontFamily: "mons" }}>Transferer cette commande à Kivu Green</Text>
                    </TouchableHighlight>
                )
            default:
                return (
                    <TouchableHighlight
                        underlayColor={Colors.pInRGBA}
                        // disabled={state === 3 ? false : true}
                        style={[btn, { elevation: 5, backgroundColor: asstate === 3 ? Colors.primaryColor : Colors.pillColor }]}
                        onPress={() => {
                            if (asstate === 3) {
                                _handleChangeState()
                            } else {
                                Snackbar.show({
                                    numberOfLines: 5,
                                    text: "Cette action n'est pas possible sur cette commande car elle n'est pas livrable, S'il s'agit d'une erreur contacter directement le service commercial de Kivugreen ",
                                    duration: Snackbar.LENGTH_SHORT,
                                    backgroundColor: Colors.dangerColor
                                });
                            }
                        }}
                    >
                        <Text style={{ color: state === 3 ? Colors.whiteColor : Colors.pInRGBA, fontFamily: "mons" }}>Transferer cette commande à Kivu Green</Text>
                    </TouchableHighlight>
                )
                break;
        }
    };

    const loadCommandeByTransaction = async () => {
        setisloading(true)
        onRunExternalRQST({
            // data
            method: "GET",
            url: `/commandes/list/bytransaction/${id_transaction}`,
        }, (err, done) => {
            setisloading(false)
            if (done) {
                const { status, message, data } = done
                if (status === 200) {
                    const { count, rows } = data
                    console.log('====================================');
                    console.log(rows);
                    console.log('====================================');
                    setgroup(rows)
                } else {
                    Snackbar.show({
                        text: "Une erreur vient de se produit lors du chargement des informations",
                        backgroundColor: Colors.dangerColor,
                        // fontFamily: "mons-e",
                        numberOfLines: 4
                    })
                }
            } else {
                Snackbar.show({
                    text: "Une erreur vient de se produit lors du chargement des informations",
                    backgroundColor: Colors.dangerColor,
                    // fontFamily: "mons-e",
                    numberOfLines: 4
                })
            }
        })
    }

    React.useEffect(() => {
        loadCommandeByTransaction()
        // if (asstate === 3 && typeaccount === 2) socketConnection()
        PosPrinter.init(false)
            .then((res) => {
                // console.log('====================================');
                // console.log(PosPrinter.isDebug(true));
                // console.log('====================================');
                // ()
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <>
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <Title navigation={navigation} title={"Commande"} subtitle={"Détails commande"} />
                <View style={{ width: "90%", alignSelf: "center" }} >
                    <View style={{ width: "100%", padding: 10, flexDirection: "row", backgroundColor: Colors.pillColor, marginTop: Dims.iconsize, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                        <Text style={{ fontFamily: "mons-b", fontSize: 14, color: color, alignSelf: "center" }}>
                            {name}
                        </Text>
                        {/* <Entypo name='bookmark' color={color} size={45} /> */}
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "stretch", justifyContent: "space-between", marginTop: 20, padding: 20, backgroundColor: Colors.pillColor }}>
                        <View style={{ width: "49.5%" }}>
                            <Text style={{ textAlign: "center", fontFamily: "mons-b" }}>Client</Text>
                            <Divider style={{ paddingVertical: 5 }} />
                            <Text style={{ textAlign: "center", fontFamily: "mons-e", paddingTop: 10 }}>Nom : <Text style={{ textAlign: "right", fontFamily: "mons-b" }}>{nom}</Text> </Text>
                            <Text style={{ textAlign: "center", fontFamily: "mons-e" }} >Postnom : <Text style={{ textAlign: "right", fontFamily: "mons" }}>{postnom}</Text> </Text>
                            <Text style={{ textAlign: "center", fontFamily: "mons-e" }} >Tél. : <Text style={{ textAlign: "right", fontFamily: "mons" }}>{phone}</Text> </Text>
                            {/* <Text style={{ textAlign: "right", fontFamily: "mons-e" }} >Sexe : <Text style={{ textAlign: "right", fontFamily: "mons" }}>{sexe}</Text> </Text> */}
                        </View>
                        <View style={{ width: "1%" }} />
                        <View style={{ width: "49.5%" }}>
                            <Text style={{ textAlign: "center", fontFamily: "mons-b" }}>Type de livraison</Text>
                            <Divider style={{ paddingVertical: 5 }} />
                            <Text style={{ textAlign: "center", fontFamily: "mons-e", paddingTop: 10 }} >Type: <Text style={{ textAlign: "right", fontFamily: "mons" }}>{type}</Text> </Text>
                            <Text style={{ textAlign: "center", fontFamily: "mons-e" }}>Frais: <Text style={{ textAlign: "right", fontFamily: "mons" }} >{frais_livraison ? frais_livraison : 0}USD</Text> </Text>
                            <Text style={{ textAlign: "center", fontFamily: "mons-e" }}>Nbr. produits: <Text style={{ textAlign: "right", fontFamily: "mons" }} >{group.length || 0}</Text> </Text>
                            <Text style={{ textAlign: "center", fontFamily: "mons-e" }}>ID.: <Text style={{ textAlign: "right", fontFamily: "mons" }} >{transaction}</Text> </Text>
                        </View>
                    </View>
                </View>
                {/* <View style={{ width: "90%", alignSelf: "center", marginTop: 20 }}>
                    <Divider />
                    <View>
                        <Text style={{ fontFamily: "mons", paddingVertical: 15 }}>Commandes ( {group.length} )</Text>
                    </View>
                    <Divider />
                </View> */}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: "50%", paddingHorizontal: 20 }}
                    data={group}
                    renderItem={renderItem}
                    ListHeaderComponent={() => {
                        return (
                            <>
                                <View style={{ padding: 10, borderWidth: 1, borderColor: "#ccc", marginTop: 20, flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                                    <View style={{ width: "10%" }}>
                                        <Text style={{ fontFamily: "mons-e" }}>#</Text>
                                    </View>
                                    <View style={{ width: "20%" }}>
                                        <Text style={{ fontFamily: "mons-e" }}>Produit</Text>
                                    </View>
                                    <View style={{ width: "20%" }}>
                                        <Text style={{ fontFamily: "mons-e" }}>P.U</Text>
                                    </View>
                                    <View style={{ width: "20%" }}>
                                        <Text style={{ fontFamily: "mons-e" }}>Qté</Text>
                                    </View>
                                    <View style={{ width: "20%" }}>
                                        <Text style={{ fontFamily: "mons-e" }}>P.T</Text>
                                    </View>
                                </View>
                            </>
                        )
                    }}
                />
                <View style={{ position: "absolute", width: "100%", bottom: 20, paddingHorizontal: 20 }}>
                    <Renderbutton key={9030} ass={asstate} s={typeaccount} />
                </View>
                <Spinner
                    overlayColor='rgba(0,0,0,.9)'
                    visible={isloading}
                    size={100}
                    color={Colors.primaryColor}
                    textContent={<View style={{ flexDirection: "column", alignContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 25, fontFamily: "mons", color: Colors.primaryColor }}>Traitement en cours</Text>
                        <Text style={{ fontFamily: "mons-e", color: Colors.primaryColor }}>Envoie de la requête de connexion en cours veuillez pationtez</Text>
                    </View>}
                    textStyle={{
                        alignSelf: "center",

                    }}
                />
            </View>
            {/* ===================================== */}
            <Modal
                isVisible={show}
                animationIn={"bounceInUp"}
                animationOut={"bounceInUp"}
                avoidKeyboard={true}
                hasBackdrop={true}
                onBackButtonPress={() => {
                    setshow(false);
                    setisloading(false)
                    // socket.disconnect();
                }}
                onBackdropPress={() => {
                    setshow(false);
                    setisloading(false)
                    // socket.disconnect();
                }}
            >
                <View style={{ flex: 1, width: "100%", alignSelf: "center", height: 200, alignContent: "center", alignItems: "center" }}>
                    <View style={{ height: 400, borderRadius: 20, width: "100%", position: "absolute", bottom: -30, backgroundColor: Colors.whiteColor }}>
                        <View style={{ width: 120, height: 10, backgroundColor: Colors.primaryColor, borderRadius: 5, alignSelf: "center", marginVertical: 12 }} />
                        <View style={{ width: "96%", alignSelf: "center", alignContent: "center", alignItems: "center" }}>
                            <Text style={{ fontFamily: "mons", color: Colors.darkColor, fontSize: Dims.titletextsize }}>Transfert de commande</Text>
                            <Text style={{ fontFamily: "mons-e", color: Colors.darkColor, textAlign: "center" }}>Transfert de commande <Text style={{ fontFamily: "mons" }}>ID: {transaction}</Text> vers {appnamecompangyname}</Text>
                        </View>
                        <View style={{ position: "absolute", height: 400, alignContent: 'center', justifyContent: "center", alignItems: "center", alignSelf: "center" }} >
                            <QRCode
                                logoSize={50}
                                size={160}
                                value={encodeBase64({ string: String(transaction).concat(".").concat(id) })}
                                // logo={logoFromFile}
                                gradientDirection={[170, 0, 0, 0]}
                                color={Colors.primaryColor}
                                quietZone={5}
                                logoMargin={20}
                                linearGradient={['rgb(4,131,67)', 'rgb(255, 122,0)']}
                            />
                        </View>
                        <View style={{ width: 220, bottom: 10, position: "absolute", backgroundColor: Colors.primaryColor, borderRadius: 5, alignSelf: "center", marginVertical: 12 }}>
                            <TouchableHighlight
                                underlayColor={Colors.primaryColor}
                                style={[btn, {}]}
                                onPress={() => {
                                    setshow(false);
                                    setisloading(false)
                                }}
                            >
                                <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }} >OK, déjà scanné</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* ===================================== */}
            <Modal
                isVisible={showc}
                animationIn={"bounceInUp"}
                animationOut={"bounceInUp"}
                avoidKeyboard={true}
                hasBackdrop={true}
                onBackButtonPress={() => {
                    setshowc(false);
                    setisloading(false)
                    // socket.disconnect();
                }}
                onBackdropPress={() => {
                    setshowc(false);
                    setisloading(false)
                    // socket.disconnect();
                }}
            >
                <View style={{ flex: 1, width: "100%", alignSelf: "center", height: 200, alignContent: "center", alignItems: "center" }}>
                    <View style={{ height: 400, borderRadius: 20, width: "100%", position: "absolute", bottom: -30, backgroundColor: Colors.whiteColor }}>
                        <View style={{ width: 120, height: 10, backgroundColor: Colors.primaryColor, borderRadius: 5, alignSelf: "center", marginVertical: 12 }} />
                        <View style={{ width: "96%", alignSelf: "center", alignContent: "center", alignItems: "center" }}>
                            <Text style={{ fontFamily: "mons", color: Colors.darkColor, fontSize: Dims.titletextsize }}>Confirmation de livraison</Text>
                            <Text style={{ fontFamily: "mons-e", color: Colors.darkColor, textAlign: "center" }}>Livraison de la commande <Text style={{ fontFamily: "mons" }}>ID: {transaction}</Text> vers {nom} {postnom}</Text>
                        </View>
                        <View style={{ alignContent: 'center', justifyContent: "center", alignItems: "center", alignSelf: "center" }} >
                            <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                                <Divider style={{ marginBottom: 10 }} />
                                <Text style={{ fontFamily: "mons-e", textAlign: "center" }}>Nous avons envoyé un <Text style={{ fontFamily: "mons" }}>code</Text> au numéro <Text style={{ fontFamily: "mons" }}>{phone}</Text> du client {nom} {postnom} de  {CELL_COUNT} chiffres pour une vérification de livraison, <Text style={{ fontFamily: "mons" }}>entrer le code ici</Text></Text>
                            </View>
                            <CodeField
                                ref={ref}
                                {...props}
                                caretHidden={false}
                                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                value={value}
                                onChangeText={setValue}
                                cellCount={CELL_COUNT}
                                rootStyle={{ marginTop: 10 }}
                                keyboardType="number-pad"
                                onEndEditing={(e) => {
                                    e.preventDefault()
                                    _handleFinishTypingCode()
                                }}
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                    <Text
                                        key={index}
                                        style={[cel, { fontFamily: "mons", justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center", paddingTop: 5 }, isFocused && { borderColor: '#000' }]}
                                        onLayout={getCellOnLayoutHandler(index)}>
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </Text>
                                )}
                            />
                        </View>
                        <View style={{ width: "100%", paddingHorizontal: 20, bottom: 10, position: "absolute", backgroundColor: Colors.whiteColor, borderRadius: 5, alignSelf: "center", marginVertical: 12 }}>
                            <TouchableHighlight
                                underlayColor={Colors.primaryColor}
                                style={[btn, { marginBottom: 5 }]}
                                onPress={() => {
                                    _handleChangeStateForClient()
                                }}
                            >
                                <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }} >Code non reçu ?, renvoyer le code</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                underlayColor={Colors.primaryColor}
                                style={[btn, { backgroundColor: Colors.whiteColor }]}
                                onPress={() => {
                                    setshowc(false);
                                    setisloading(false)
                                }}
                            >
                                <Text style={{ color: Colors.pInRGBA, fontFamily: "mons-b" }} >Annuler</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 0,
        paddingTop: 20,
    },
    item: {
        width: Dims.width,
        marginBottom: 0,
        borderTopWidth: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    text: {
        alignSelf: "flex-start",
        marginBottom: 5,
    },
});