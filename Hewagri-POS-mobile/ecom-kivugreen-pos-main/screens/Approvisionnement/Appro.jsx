import * as React from 'react'
import { Title } from '../../components/Title/Title';
import { TouchableHighlight, View, TextInput, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import Snackbar from 'react-native-snackbar';
import { onRunExternalRQST } from '../../services/communications';
import { addDays, belongsToThisCooperative, checkIfExpired, decodeBase64, formatDate, randomLongNumber, randomString, unixToDate } from '../../assets/helper/helper.all';
import DialogBox from 'react-native-dialogbox';
import { routes } from '../../assets/helper/helper.routes';
import { BarcodereaderComponenent } from '../../components/Scanner/ScannerComponent';
import PosPrinter from 'react-native-pos-printer';

export const ApprovisionnemtScreen = ({ route, navigation }) => {

    const [isloading, setisloading] = React.useState(false)
    const [products, setproducts] = React.useState([])
    const ref = React.useRef();
    const { num_enregistrement, sigle, cooperative, adresse, __tbl_ecom_users } = global.coopec || {}
    const dialogbox = ref //React.useRef();
    const [rescann, setrescann] = React.useState(false)
    const [customer, setcustomer] = React.useState({})

    const onLoadProducts = async () => {
        setisloading(true)
        onRunExternalRQST({
            url: "/produits/list",
            method: "GET",
        }, (err, done) => {
            setisloading(false)
            if (done) {
                const { message, status, data } = done;
                if (status === 200) {
                    const { rows } = data;
                    setproducts(rows)
                } else {
                    Snackbar.show({
                        text: "Une erreur inconue vient de se produire ! Vérifier la connexion internet puis réessayer",
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: Colors.dangerColor
                    });
                }
            } else {
                Snackbar.show({
                    text: "Une erreur inconue vient de se produire !",
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: Colors.dangerColor
                });
            }
        })
    }

    React.useEffect(() => {
        onLoadProducts()
        PosPrinter.init(false)
            .then((res) => {
                // getDevices()
                // console.log('====================================');
                // console.log(PosPrinter.isDebug(true));
                // console.log('====================================');
                // ()
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <>
            <Title title={"Approvisionnement"} subtitle={"Approvisionnement stock coopérative"} navigation={navigation} />
            <View style={styles.container}>
                <BarcodereaderComponenent
                    navigation={navigation}
                    key={67657}
                    rescann={rescann}
                    cb={async (d) => {
                        const { data, target, type } = d;
                        setrescann(false)
                        const str = decodeBase64({ string: data });

                        if (str !== false) {
                            const [expiresin, id_customer, id_coopec] = String(str).split(".");
                            if (expiresin && id_customer && id_coopec) {
                                if (!checkIfExpired({ unix: expiresin })) {
                                    if (belongsToThisCooperative({ id_cooperative: id_coopec })) {
                                        Snackbar.show({
                                            text: "Scan réussi; Chargement en cours ...",
                                            duration: Snackbar.LENGTH_LONG,
                                            backgroundColor: Colors.primaryColor
                                        });
                                        navigation.navigate(routes['storagemaker'], { customer, item: str, cooperative: global.coopec, products })
                                    } else {
                                        ref.current.confirm({
                                            title: <Text style={{ fontFamily: "mons" }}>Carte non autorisée</Text>,
                                            content: [<Text style={{ fontFamily: "mons-e" }}>Cette opération ne peut être effectuer car la carte scannée appartient à une coopérative autre que <Text style={{ fontFamily: "mons" }}>{cooperative}</Text> essayer avec une autre carte</Text>],
                                            ok: {
                                                text: "Réessayer",
                                                style: {
                                                    fontFamily: "mons",
                                                    color: Colors.primaryColor,
                                                },
                                                callback: () => {
                                                    setrescann(true)
                                                }
                                            },
                                            cancel: {
                                                text: "Annuler",
                                                style: {
                                                    fontFamily: "mons-e",
                                                    color: Colors.primaryColor
                                                },
                                                callback: () => navigation.navigate(routes['home'])
                                            }
                                        })
                                    }
                                } else {
                                    dialogbox.current.confirm({
                                        title: <Text style={{ fontFamily: "mons" }}>Carte expirée</Text>,
                                        content: [<Text style={{ fontFamily: "mons-e" }}>Cette opération ne peut être effectuer car la carte a déjà expiée; sa date d'expiration est <Text style={{ fontFamily: "mons" }}>{unixToDate({ unix: expiresin })}</Text> essayer avec une autre carte</Text>],
                                        ok: {
                                            text: "Réessayer",
                                            style: {
                                                fontFamily: "mons",
                                                color: Colors.primaryColor,
                                            },
                                            callback: () => {
                                                setrescann(true)
                                            }
                                        },
                                        cancel: {
                                            text: "Annuler",
                                            style: {
                                                fontFamily: "mons-e",
                                                color: Colors.primaryColor
                                            },
                                            callback: () => navigation.navigate(routes['home'])
                                        }
                                    })
                                }
                            } else {
                                dialogbox.current.confirm({
                                    title: <Text style={{ fontFamily: "mons" }}>Lecteur QR Code</Text>,
                                    content: [<Text style={{ fontFamily: "mons" }}>Le QRCode scanné est incorrect, veuillez scanner un QRCode qui est correcte</Text>],
                                    ok: {
                                        text: "Réessayer",
                                        style: {
                                            fontFamily: "mons",
                                            color: Colors.primaryColor,
                                        },
                                        callback: () => {
                                            setrescann(true)
                                        }
                                    },
                                    cancel: {
                                        text: "Annuler",
                                        style: {
                                            fontFamily: "mons-e",
                                            color: Colors.primaryColor
                                        },
                                        callback: () => navigation.navigate("tabs")
                                    }
                                })
                            }
                        } else {
                            dialogbox.current.confirm({
                                title: <Text style={{ fontFamily: "mons" }}>Lecteur QR Code</Text>,
                                content: [<Text style={{ fontFamily: "mons" }}>Le QRCode scanné est incorrect, veuillez scanner un QRCode qui est correcte</Text>],
                                ok: {
                                    text: "Réessayer",
                                    style: {
                                        fontFamily: "mons",
                                        color: Colors.primaryColor,
                                    },
                                    callback: () => {
                                        setrescann(true)
                                    }
                                },
                                cancel: {
                                    text: "Annuler",
                                    style: {
                                        fontFamily: "mons-e",
                                        color: Colors.primaryColor
                                    },
                                    callback: () => navigation.navigate("tabs")
                                }
                            })
                        }
                    }}
                />
            </View>
            <DialogBox ref={ref} isOverlayClickClose={false} />
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});