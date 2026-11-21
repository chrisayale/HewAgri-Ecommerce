import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, ScrollView, Keyboard, TouchableHighlightBase, RefreshControl } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
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

export const SigninScreen = ({ navigation, route }) => {

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
                                    // console.log('====================================');
                                    // console.log(user, token);
                                    // console.log('====================================');
                                    // return false;
                                    if (!isNaN(id_cooperative)) {
                                        // typeaccount : 1: Livreur 2: Admin cooperative
                                        // Clear existing users first to avoid seed data conflicts
                                        onRunRemoveQRY({ table: tbl_users, clause: '' }, () => {
                                            onRunInsertQRY({
                                            table: tbl_users,
                                            columns: `'realid', 'nom', 'postnom', 'prenom', 'token', 'phone', 'email', 'lastlogin', 'uuid', 'avatar', 'idcooperative', 'chaine', 'crearedon', 'sexe', 'roles', 'typeaccount'`,
                                            dot: "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?",
                                            values: [`${id}`, `${nom}`, `${postnom}`, `${prenom}`, `${token}`, `${phone}`, `${email}`, `${lastlogin}`, `${uuid}`, `${avatar}`, `${id_cooperative}`, `${JSON.stringify(data)}`, `${new Date().toLocaleString()}`, `${sexe}`, `${JSON.stringify(roles)}`, `${2}`]
                                        }, (err, insert) => {
                                            if (insert) {
                                                global.token = token;
                                                global.user = insert;
                                                onRunExternalRQST({
                                                    method: "GET",
                                                    url: `/cooperatives/cooperative/${id_cooperative}`
                                                }, (err, done) => {
                                                    if (done) {
                                                        const { status, message, data } = done;
                                                        if (status === 200) {
                                                            global.idcooperative = id_cooperative
                                                            global.coopec = data;
                                                            navigation.replace("tabs");
                                                        } else {
                                                            setisloading(false)
                                                            setoutput("Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer")
                                                            Snackbar.show({
                                                                text: "Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer",
                                                                duration: Snackbar.LENGTH_LONG,
                                                                backgroundColor: Colors.dangerColor
                                                            });
                                                        }
                                                    } else {
                                                        setisloading(false)
                                                        setoutput("Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer")
                                                        Snackbar.show({
                                                            text: "Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer",
                                                            duration: Snackbar.LENGTH_LONG,
                                                            backgroundColor: Colors.dangerColor
                                                        });
                                                    }
                                                })
                                            } else {
                                                setisloading(false);
                                                setoutput("Une erreur est survenue lors de traitement des informations !")
                                                Snackbar.show({
                                                    text: "Une erreur est survenue lors de traitement des informations !",
                                                    duration: Snackbar.LENGTH_INDEFINITE,
                                                    backgroundColor: Colors.dangerColor
                                                });
                                            }
                                        })
                                    })
                                    } else {
                                        if (roles.includes(3)) {
                                            // Clear existing users first to avoid seed data conflicts
                                            onRunRemoveQRY({ table: tbl_users, clause: '' }, () => {
                                                onRunInsertQRY({
                                                table: tbl_users,
                                                columns: `'realid', 'nom', 'postnom', 'prenom', 'token', 'phone', 'email', 'lastlogin', 'uuid', 'avatar', 'idcooperative', 'chaine', 'crearedon', 'sexe', 'roles', 'typeaccount'`,
                                                dot: "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?",
                                                values: [`${id}`, `${nom}`, `${postnom}`, `${prenom}`, `${token}`, `${phone}`, `${email}`, `${lastlogin}`, `${uuid}`, `${avatar}`, `${0}`, `${JSON.stringify(data)}`, `${new Date().toLocaleString()}`, `${sexe}`, `${JSON.stringify(roles)}`, `${1}`]
                                            }, (err, insert) => {
                                                if (insert) {
                                                    global.token = token;
                                                    global.user = insert;
                                                    navigation.replace(routes['homelivreur']);
                                                    // onRunExternalRQST({
                                                    //     method: "GET",
                                                    //     url: `/cooperatives/cooperative/${id_cooperative}`
                                                    // }, (err, done) => {
                                                    //     if (done) {
                                                    //         const { status, message, data } = done;
                                                    //         if (status === 200) {
                                                    //             global.idcooperative = id_cooperative
                                                    //             global.coopec = data;
                                                    //             navigation.replace("tabs");
                                                    //         } else {
                                                    //             setisloading(false)
                                                    //             setoutput("Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer")
                                                    //             Snackbar.show({
                                                    //                 text: "Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer",
                                                    //                 duration: Snackbar.LENGTH_LONG,
                                                    //                 backgroundColor: Colors.dangerColor
                                                    //             });
                                                    //         }
                                                    //     } else {
                                                    //         setisloading(false)
                                                    //         setoutput("Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer")
                                                    //         Snackbar.show({
                                                    //             text: "Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer",
                                                    //             duration: Snackbar.LENGTH_LONG,
                                                    //             backgroundColor: Colors.dangerColor
                                                    //         });
                                                    //     }
                                                    // })
                                                } else {
                                                    setisloading(false);
                                                    setoutput("Une erreur est survenue lors de traitement des informations !")
                                                    Snackbar.show({
                                                        text: "Une erreur est survenue lors de traitement des informations !",
                                                        duration: Snackbar.LENGTH_INDEFINITE,
                                                        backgroundColor: Colors.dangerColor
                                                    });
                                                }
                                            })
                                        })
                                        } else {
                                            setoutput(`Désolé ${nom} ${postnom} votre compte n'est associé à aucune coopérative; et ne possède pas les privilège du compte livreur de ${appnamecompangyname}!`)
                                            Snackbar.show({
                                                numberOfLines: 10,
                                                text: `Désolé ${nom} ${postnom} votre compte n'est associé à aucune coopérative; et ne possède pas les privilège du compte livreur de ${appnamecompangyname}!`,
                                                duration: Snackbar.LENGTH_LONG,
                                                backgroundColor: Colors.dangerColor
                                            });
                                        }
                                    }
                                    break;
                                case 403:
                                    setoutput("Le mot de passe ou le nom d'utilisateur est incorect")
                                    Snackbar.show({
                                        text: "Le mot de passe ou le nom d\'utilisateur incorect",
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
                                        text: "Une erreur inconue vient de se produire !",
                                        duration: Snackbar.LENGTH_SHORT,
                                        backgroundColor: Colors.dangerColor
                                    });
                                    break;
                                default:
                                    setoutput("Une erreur inconue vient de se produire !")
                                    Snackbar.show({
                                        text: "Une erreur inconue vient de se produire !",
                                        duration: Snackbar.LENGTH_SHORT,
                                        backgroundColor: Colors.dangerColor
                                    });
                                    break;
                            }
                        } else {
                            setisloading(false)
                            setoutput("Une erreur inconue vient de se produire !")
                            Snackbar.show({
                                text: "Une erreur inconue vient de se produire !",
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: Colors.dangerColor
                            });
                        }
                    })
                } catch (error) {
                    Snackbar.show({
                        text: "Une erreur inconue vient de se produire !",
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
            <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
                <Header colors={Colors.whiteColor} />
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 0, backgroundColor: Colors.primaryColor }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode='interactive'
                    keyboardShouldPersistTaps="handled"
                    refreshControl={<RefreshControl
                        colors={[Colors.primaryColor]}
                        refreshing={isloading}
                        onRefresh={() => {}}
                    />}
                >
                    <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor, height: Dims.height, marginTop: Dims.smallradius }}>
                        <View style={{ display: String(output).length > 0 ? "flex" : "none", width: "85%", alignSelf: "center", marginTop: 30, backgroundColor: Colors.dInRGBA, borderRadius: 10, padding: 10, flexDirection: "column" }}>
                            {/* <FontAwesome name="warning" size={10} color={Colors.dangerColor} style={{ alignSelf: "center" }} /> */}
                            <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize, marginVertical: 10, color: Colors.dangerColor, textAlign: "left", paddingHorizontal: 10 }}>
                                {output}
                            </Text>
                        </View>
                        <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                            <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Adresse mail | nom d'utilisateur</Text>
                                <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                    <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                        <TextInput placeholder='ex: user@balabala.app' value={num} maxLength={50} keyboardType={"email-address"} onChangeText={(t) => setnum(t)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                    </View>
                                    <View style={[inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <FontAwesome5 name="envelope" size={Dims.iconsize} color={Colors.whiteColor} />
                                    </View>
                                </View>
                            </View>
                            {/* ------------------------ */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 40 }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Mot de passe</Text>
                                <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                    <TouchableHighlight
                                        underlayColor={Colors.whiteColor}
                                        onPress={() => seteye(!eye)}
                                        style={[inputGroup.iconcontainer, { backgroundColor: Colors.whiteColor }]}
                                    >
                                        <Ionicons name={eye ? "eye-off" : "eye"} size={Dims.iconsize} color={Colors.primaryColor} />
                                    </TouchableHighlight>
                                    <View style={[inputGroup.inputcontainer, { width: "60%" }]}>
                                        <TextInput placeholder='******' value={password} secureTextEntry={eye} enablesReturnKeyAutomatically onChangeText={(t) => setpassword(t)} style={[inputGroup.input, { fontFamily: "mons" }]} />
                                    </View>
                                    <View style={[inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <Entypo name="lock" size={Dims.iconsize} color={Colors.whiteColor} />
                                    </View>
                                </View>
                            </View>
                            {/* ------------------------ */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginVertical: 25, marginTop: 40 }}>
                                <TouchableHighlight
                                    onPress={() => {
                                        onSubmit()
                                    }}
                                    disabled={isloading}
                                    underlayColor={Colors.primaryColor}
                                    style={btn}
                                >
                                    {isloading
                                        ?
                                        <Loader />
                                        :
                                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Connexion</Text>
                                    }
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", width: "85%", alignSelf: "center", alignContent: "center", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ width: "30%" }}>
                                <Divider style={{}} />
                            </View>
                            <View>
                                <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>OU</Text>
                            </View>
                            <View style={{ width: "30%" }}>
                                <Divider />
                            </View>
                        </View>
                        <View style={{ marginTop: 30, flexDirection: "column", width: "85%", alignSelf: "center", paddingBottom: 20 }}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ width: "33.3%", borderTopColor: Colors.primaryColor, borderTopWidth: 6 }}></View>
                                <View style={{ width: "33.3%", borderTopColor: Colors.primaryColor, borderTopWidth: 6 }}></View>
                                <View style={{ width: "33.3%", borderTopColor: Colors.primaryColor, borderTopWidth: 6 }}></View>
                            </View>
                            <TouchableHighlight style={[btn, { backgroundColor: Colors.pillColor, marginVertical: 20 }]} >
                                <Text style={{ fontFamily: "mons-e", paddingVertical: 12, textAlign: "center", color: Colors.primaryColor }}>Mot de passe oublié ?</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={[btn, { backgroundColor: Colors.pillColor }]} onPress={() => { }} >
                                <Text style={{ fontFamily: "mons-e", color: Colors.dark, textAlign: "center", paddingVertical: 12, color: Colors.primaryColor }}>Vous rencontrez un problème de connexion ?</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </ScrollView>
                <Footer />
                <DialogBox ref={ref} isOverlayClickClose={false} />
            </View>
            {/* <Spinner
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
            /> */}
        </>
    )
}