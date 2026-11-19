import React, { memo } from 'react';
import { checkIfExpired, decodeBase64, randomLongNumber, unixToDate } from "../../assets/helper/helper.all";
import { BarcodereaderComponenent } from "../../components/Scanner/ScannerComponent";
import DialogBox from 'react-native-dialogbox';
import { Text } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import io from 'socket.io-client';
import { appnamecompangyname, endpoint } from '../../assets/configs/configs';
import Netinfo from '@react-native-community/netinfo';
import { onRunExternalRQST } from '../../services/communications';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
import { View } from 'react-native';
import { MessageComponent } from '../../components/Message/Messagecomponent';

const ScreenLivreurGetTheCommande = ({ navigation }) => {

    const dialogbox = React.useRef(null);
    const [rescann, setrescann] = React.useState(false)
    const [isloading, setisloading] = React.useState(false)
    const [title, settitle] = React.useState("");
    const [subtitle, setsubtitle] = React.useState("");
    const [type, setype] = React.useState(1) // 1: means success, 2: failed
    const socket = io(endpoint + "/", {
        autoConnect: true,

    });
    const [message, setMessage] = React.useState('');
    const [messages, setMessages] = React.useState([]);
    const [show, setshow] = React.useState(false);
    // const { num_enregistrement, phone, sigle, cooperative, adresse, __tbl_ecom_users, id: idcooperative } = global.coopec || {}

    const _handleChangeState = async ({ transaction, id_customer }) => {
        Netinfo.fetch().then(is => {
            if (is.isConnected && is.isInternetReachable) {
                setisloading(true)
                onRunExternalRQST({
                    url: `/commandes/commande/changestate/${transaction}`,
                    method: "PUT",
                }, (err, done) => {
                    setisloading(false)
                    setshow(true)
                    if (done) {
                        const { status, data } = done;
                        if (status === 200) {
                            settitle("Opération réussie")
                            setsubtitle("Opération réussie")
                            setype(1)
                            setshow(true)
                            Snackbar.show({
                                numberOfLines: 6,
                                text: `Transfert de la commande ID: ${transaction} à ${appnamecompangyname} a réussie avec succès !`,
                                duration: Snackbar.LENGTH_LONG,
                                backgroundColor: Colors.successColor
                            });
                        } else {
                            setype(2)
                            settitle("Opération échouée")
                            setsubtitle("Opération échouée")
                            setshow(true)
                            Snackbar.show({
                                numberOfLines: 6,
                                text: `Une erreur vient de se produire lors du transfert de la commande ${transaction} à ${appnamecompangyname}, réessayer un peu plus tard`,
                                duration: Snackbar.LENGTH_LONG,
                                backgroundColor: Colors.dangerColor
                            });
                        }
                    } else {
                        setype(2)
                        settitle("Opération échouée")
                        setsubtitle("Opération échouée")
                        setshow(true)
                        Snackbar.show({
                            numberOfLines: 6,
                            text: `Une erreur vient de se produire lors du transfert de la commande ${transaction} à ${appnamecompangyname}, réessayer un peu plus tard`,
                            duration: Snackbar.LENGTH_LONG,
                            backgroundColor: Colors.dangerColor
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

    React.useEffect(() => {

        // socket.on('connect', () => {
        //     // setConnected(true);
        //     alert(2)
        // });

        // socket.on('message', (data) => {
        //     setMessages([...messages, data]);
        // });

        // return () => {
        //     socket.disconnect();
        // };
    }, [])

    return (
        <>
            <BarcodereaderComponenent
                navigation={navigation}
                key={randomLongNumber({ length: 6 })}
                rescann={rescann}
                cb={(d) => {
                    const { data, target, type } = d;

                    setrescann(false)
                    const str = decodeBase64({ string: data });
                    if (str !== false) {
                        const [transaction, id_customer] = String(str).split(".");
                        if (transaction && id_customer) {
                            _handleChangeState({ id_customer, transaction })
                        } else {
                            dialogbox.current.confirm({
                                title: <Text style={{ fontFamily: "mons" }}>QR Code</Text>,
                                content: [<Text style={{ fontFamily: "mons-e" }}>Cette opération ne peut être effectuer car le qr code que vous avez scanner est invalide, réessayer avec un QRCode valide</Text>],
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
            <DialogBox ref={dialogbox} />
            {show && <MessageComponent type={type} action={() => { }} navigation={navigation} title={title} subtitle={subtitle} key={9202020} />}
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
        </>
    );
};

export const LivreurgotScreen = memo(ScreenLivreurGetTheCommande);
