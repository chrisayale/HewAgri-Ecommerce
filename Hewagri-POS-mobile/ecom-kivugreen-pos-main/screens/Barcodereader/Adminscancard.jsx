import React, { memo } from 'react';
import { checkIfExpired, decodeBase64, randomLongNumber, unixToDate } from "../../assets/helper/helper.all";
import { BarcodereaderComponenent } from "../../components/Scanner/ScannerComponent";
import DialogBox from 'react-native-dialogbox';
import { Text } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import io from 'socket.io-client';
import { endpoint } from '../../assets/configs/configs';
import Netinfo from '@react-native-community/netinfo';
import { onRunExternalRQST } from '../../services/communications';
import Snackbar from 'react-native-snackbar';

const ScreenCoopecScanCard = ({ navigation }) => {

    const dialogbox = React.useRef(null);
    const [rescann, setrescann] = React.useState(false)
    const [isloading, setisloading] = React.useState(true)
    const socket = io(endpoint + "/", {
        autoConnect: true,

    });
    const [message, setMessage] = React.useState('');
    const [messages, setMessages] = React.useState([]);
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
                    if (done) {
                        const { status, data } = done;
                        if (status === 200) {
                            Snackbar.show({
                                numberOfLines: 6,
                                text: `Transfert de la commande ID: ${transaction} à ${appnamecompangyname} a réussie avec succès !`,
                                duration: Snackbar.LENGTH_LONG,
                                backgroundColor: Colors.successColor
                            });
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

    React.useEffect(() => {

        socket.on('connect', () => {
            // setConnected(true);
            alert(2)
        });

        socket.on('message', (data) => {
            setMessages([...messages, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, [messages])

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
                    socket.emit('message', message);

                    if (str !== false) {
                        const [transaction, id_customer] = String(str).split(".");
                        console.log('====================================');
                        console.log("ID Customer is ==> ", transaction, id_customer);
                        console.log('====================================');
                        if (!transaction && id_customer) {
                            // _handleChangeState({ id_customer, transaction })
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
        </>
    );
};

export const LivreurgotScreen = memo(ScreenCoopecScanCard);
