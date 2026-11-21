import * as React from 'react';
import { StatusBar, View, Text, Animated, TouchableHighlight, Modal, TextInput, Keyboard, ScrollView, RefreshControl } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { AntDesign, Entypo, Ionicons, Feather, MaterialIcons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import DialogBox from 'react-native-dialogbox';
import { routes } from '../../assets/helper/helper.routes';
import Snackbar from 'react-native-snackbar';
import { onRunExternalRQST } from '../../services/communications';
import { btnHeader, btnHome } from '../../assets/styles/Styles';
import { StoreAsRegisterComponent } from '../../components/Store/Storeregister';
import { Tooltip } from 'react-native-elements';

export const HomeScreen = ({ navigation }) => {

    const ref = React.useRef(null);
    const [inf, setinf] = React.useState({});
    const [isloading, setisloading] = React.useState(false)
    const Consts = Colors;
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
                    // Re-destructure with updated data
                    const { num_enregistrement: newNumEnregistrement, phone: newPhone, sigle: newSigle, cooperative: newCooperative, adresse: newAdresse, __tbl_ecom_users: newUsers = [] } = data || {};
                    setinf({
                        // ...global.coopec,
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
        // tooltipRef.current.toggleTooltip();
        __()
    }, [])

    return (
        <>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.primaryColor} />
            <View
                style={{ paddingBottom: 0, backgroundColor: Consts.primaryColor, width: "100%" }}
            >
                <View style={{ minHeight: 120, paddingBottom: 20 }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ width: "60%", padding: 12, height: "auto" }}>
                            <TouchableHighlight
                                underlayColor={"transparent"}
                                onPress={() => {
                                    navigation.navigate(routes['aboutcoop'])
                                }}
                            >
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: 18, color: Consts.whiteColor, fontFamily: "mons", textTransform: "capitalize" }}>
                                        {inf && inf['cooperative'] ? `${inf['cooperative']}` : "---"}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="call" color={Consts.whiteColor} style={{ paddingRight: 7 }} />
                                <Text style={{ color: Consts.whiteColor, fontFamily: "mons-e", fontSize: 11 }}> {inf && inf['phone']}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MaterialIcons name="email" color={Consts.whiteColor} style={{ paddingRight: 7 }} />
                                <Text style={{ color: Consts.whiteColor, fontFamily: "mons-e", fontSize: 11 }}> {inf && inf['email']}</Text>
                            </View>
                        </View>
                        <View style={{ width: "40%", alignContent: "flex-end", alignItems: "flex-end", padding: 8, flexDirection: "row", justifyContent: "space-between" }}>
                            <Tooltip
                                popover={<Text>Stock disponible dans {cooperative}</Text>}
                                withOverlay
                                withPointer
                                toggleOnPress={true}
                                ref={tooltipRef}
                            >
                                <TouchableHighlight
                                    underlayColor={Consts.primaryColor}
                                    style={[btnHeader,]}
                                    onPress={_ => {
                                        // setshow(!show)
                                        navigation.navigate(routes['storagestate'])
                                    }}>
                                    <MaterialCommunityIcons name="store-check" size={40} color={Colors.whiteColor} style={{ padding: 10 }} />
                                </TouchableHighlight>
                            </Tooltip>
                            <TouchableHighlight
                                underlayColor={Consts.primaryColor}
                                style={[btnHeader]}
                                onPress={_ => {
                                    __()
                                }}>
                                <Ionicons name="refresh-circle" size={40} color={Consts.whiteColor} style={{ padding: 10 }} />
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View>
                        <View style={{ width: "95%", alignSelf: "center", borderTopColor: Consts.pillColor, borderTopWidth: .6, flexDirection: "row" }}>
                            <TouchableHighlight
                                underlayColor={"transparent"}
                                onPress={() => {
                                    navigation.navigate(routes['members'])
                                }}
                                style={{ width: "50%", paddingHorizontal: 5, marginTop: 6 }}
                            >
                                <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                                    <View style={{ marginTop: 10, alignContent: "center" }}>
                                        <Text style={{ fontFamily: "mons-e", color: Consts.pillColor, textAlign: "center" }}>Nombre membres</Text>
                                        <Text style={{ fontFamily: "mons", color: Consts.pillColor, textAlign: "center" }}>{inf && inf['nombre_membres'] ? inf['nombre_membres'].toString().concat(" Membre ( s ) ") : 0}</Text>
                                    </View>
                                    <MaterialIcons name="arrow-drop-down" size={24} color={Colors.whiteColor} />
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                underlayColor={"transparent"}
                                onPress={() => {
                                    navigation.navigate(routes['profile'])
                                }}
                                style={{ width: "50%", paddingHorizontal: 5, marginTop: 6, borderLeftWidth: .6, borderLeftColor: Consts.pillColor }}
                            >
                                <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ fontFamily: "mons-e", color: Consts.pillColor, textAlign: "center" }}>Administrateur</Text>
                                        <Text style={{ fontFamily: "mons", color: Consts.whiteColor, textAlign: "center" }}>
                                            {inf && inf['nom'] ? `${inf['nom']} ${inf['postnom']}` : "---"}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="arrow-drop-down" size={24} color={Colors.whiteColor} />
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ backgroundColor: Consts.neutreColor, flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: "30%" }}
                    refreshControl={<RefreshControl
                        colors={[Colors.primaryColor]}
                        refreshing={isloading}
                        onRefresh={__}
                    />}
                >
                    <View style={{ marginTop: 10, width: "100%", alignSelf: "center", alignContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: "column", width: "100%" }}>
                            <View style={{ flexDirection: "row", alignContent: "center", alignContent: "center", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ width: "50%", padding: 10 }} >
                                    <TouchableHighlight
                                        style={[btnHome]}
                                        underlayColor={Colors.pillColor}
                                        onPress={() => {
                                            navigation.navigate(routes['bonentree'])
                                        }}
                                    >
                                        <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                                            <View style={{ borderColor: Consts.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                                                <MaterialCommunityIcons name="store-plus" size={Dims.iconsize * 1.5} color={Consts.primaryColor} />
                                            </View>
                                            <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Consts.primaryColor }}>Approvisionnement</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>

                                <View style={{ width: "50%", padding: 10 }} >
                                    <TouchableHighlight
                                        style={[btnHome]}
                                        underlayColor={Colors.pillColor}
                                        onPress={() => navigation.navigate(routes['credit'])}
                                    >
                                        <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                                            <View style={{ borderColor: Consts.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                                                <Entypo name="credit" size={Dims.iconsize * 1.5} color={Consts.primaryColor} />
                                            </View>
                                            <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Consts.primaryColor }}>Démande de crédit</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                        {/* --------------------------------- */}
                        <View style={{ flexDirection: "row", alignContent: "center", alignContent: "center", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ width: "50%", padding: 10 }} >
                                <TouchableHighlight
                                    style={[btnHome]}
                                    underlayColor={Colors.pillColor}
                                    onPress={() => {
                                        navigation.navigate(routes['addmember'])
                                    }}
                                >
                                    <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                                        <View style={{ borderColor: Consts.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                                            <Feather name="user-plus" size={Dims.iconsize * 1.5} color={Consts.primaryColor} />
                                        </View>
                                        <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Consts.primaryColor }}>Ajouter un membre</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>

                            <View style={{ width: "50%", padding: 10 }} >
                                <TouchableHighlight
                                    style={[btnHome]}
                                    underlayColor={Colors.pillColor}
                                    onPress={() => navigation.navigate(routes['members'])}
                                >
                                    <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                                        <View style={{ borderColor: Consts.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                                            <Feather name="users" size={Dims.iconsize * 1.5} color={Consts.primaryColor} />
                                        </View>
                                        <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Consts.primaryColor }}>Liste des membres</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                        {/* --------------------------------- */}
                        <View style={{ flexDirection: "row", alignContent: "center", alignContent: "center", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ width: "50%", padding: 10 }} >
                                <TouchableHighlight
                                    style={[btnHome]}
                                    underlayColor={Colors.pillColor}
                                    onPress={() => {
                                        navigation.navigate(routes['storage'])
                                    }}
                                >
                                    <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                                        <View style={{ borderColor: Consts.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                                            <MaterialCommunityIcons name="store" size={Dims.iconsize * 1.5} color={Consts.primaryColor} />
                                        </View>
                                        <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Consts.primaryColor }}>Stock disponible</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>

                            <View style={{ width: "50%", padding: 10 }} >
                                <TouchableHighlight
                                    style={[btnHome]}
                                    underlayColor={Colors.pillColor}
                                    onPress={() => navigation.navigate(routes['commandes'])}
                                >
                                    <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                                        <View style={{ borderColor: Consts.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                                            <MaterialCommunityIcons name="cart-arrow-down" size={Dims.iconsize * 1.5} color={Consts.primaryColor} />
                                        </View>
                                        <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Consts.primaryColor }}>Toutes les commandes</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>

                        </View>
                        {/* --------------------------------- */}
                        <View style={{ flexDirection: "row", alignContent: "flex-start", alignContent: "flex-start", justifyContent: "flex-start", alignItems: "flex-start", width: "100%" }}>
                            <View style={{ width: "50%", padding: 10 }} >
                                <TouchableHighlight
                                    style={[btnHome]}
                                    underlayColor={Colors.pillColor}
                                    onPress={() => {
                                        navigation.navigate(routes['storagefinished'])
                                    }}
                                >
                                    <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                                        <View style={{ borderColor: Consts.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                                            <MaterialCommunityIcons name="store-check" size={Dims.iconsize * 1.5} color={Consts.primaryColor} />
                                        </View>
                                        <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Consts.primaryColor }}>Stock ecoulé</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>

                            <View style={{ width: "50%", padding: 10 }} >
                                <TouchableHighlight
                                    style={[btnHome]}
                                    underlayColor={Colors.pillColor}
                                    onPress={() => navigation.navigate(routes['commandesdone'])}
                                >
                                    <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                                        <View style={{ borderColor: Consts.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                                            <MaterialCommunityIcons name="cart-arrow-up" size={Dims.iconsize * 1.5} color={Consts.primaryColor} />
                                        </View>
                                        <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Consts.primaryColor }}>Commandes effectuées</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                        {/* --------------------------------- */}
                        <View style={{ flexDirection: "row", alignContent: "flex-start", alignContent: "flex-start", justifyContent: "flex-start", alignItems: "flex-start", width: "100%" }}>
                            <View style={{ width: "50%", padding: 10 }} >
                                <TouchableHighlight
                                    style={[btnHome]}
                                    underlayColor={Colors.pillColor}
                                    onPress={() => {
                                        navigation.navigate(routes['listecredits'])
                                    }}
                                >
                                    <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                                        <View style={{ borderColor: Consts.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                                            <Entypo name="credit" size={Dims.iconsize * 1.5} color={Consts.primaryColor} />
                                            {/* <MaterialCommunityIcons name="store-check" size={Dims.iconsize * 1.5} color={Consts.primaryColor} /> */}
                                        </View>
                                        <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Consts.primaryColor }}>Liste démandes de crédits</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>

                            <View style={{ width: "50%", padding: 10 }} >
                                <TouchableHighlight
                                    style={[btnHome]}
                                    underlayColor={Colors.pillColor}
                                    onPress={() => {
                                        navigation.navigate(routes['historiques'])
                                    }}
                                >
                                    <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                                        <View style={{ borderColor: Consts.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                                            <MaterialCommunityIcons name="store-check" size={Dims.iconsize * 1.5} color={Consts.primaryColor} />
                                        </View>
                                        <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Consts.primaryColor }}>Historiques</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                        {/* --------------------------------- */}
                        <View style={{ flexDirection: "row", alignContent: "flex-start", alignContent: "flex-start", justifyContent: "flex-start", alignItems: "flex-start", width: "100%" }}>

                            <View style={{ width: "50%", padding: 10 }} >
                                <TouchableHighlight
                                    style={[btnHome]}
                                    underlayColor={Colors.pillColor}
                                    onPress={() => navigation.navigate(routes['storagestate'])}
                                >
                                    <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                                        <View style={{ borderColor: Consts.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                                            <MaterialCommunityIcons name="store-check" size={Dims.iconsize * 1.5} color={Consts.primaryColor} />
                                        </View>
                                        <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Consts.primaryColor }}>Etat de stock</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={{ width: "50%", padding: 10 }} >
                                <TouchableHighlight
                                    style={[btnHome]}
                                    underlayColor={Colors.pillColor}
                                    onPress={() => navigation.navigate(routes['aboutcoop'])}
                                >
                                    <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", paddingTop: 10 }}>
                                        <View style={{ borderColor: Consts.primaryColor, borderWidth: 0, borderRadius: 12, padding: 12, marginBottom: 5 }}>
                                            <MaterialCommunityIcons name="information" size={Dims.iconsize * 1.5} color={Consts.primaryColor} />
                                        </View>
                                        <Text style={{ textAlign: "center", fontFamily: "mons-b", fontSize: 12, color: Consts.primaryColor }}>A propos</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <DialogBox ref={ref} isOverlayClickClose={false} />
        </>
    )
}