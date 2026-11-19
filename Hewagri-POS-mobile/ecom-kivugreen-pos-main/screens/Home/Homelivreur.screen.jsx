import * as React from 'react';
import { StatusBar, View, Text, Animated, TouchableHighlight, Modal, TextInput, Keyboard, RefreshControl, FlatList } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { AntDesign, Entypo, Ionicons, Feather, MaterialIcons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import DialogBox from 'react-native-dialogbox';
import { routes } from '../../assets/helper/helper.routes';
import Snackbar from 'react-native-snackbar';
import { onRunExternalRQST } from '../../services/communications';
import Spinner from 'react-native-loading-spinner-overlay';
import { appname, endpoint } from '../../assets/configs/configs';
import { now, renderState } from '../../assets/helper/helper.all';
import { EmptyList } from '../../components/Emptylist/com.emptylist';
import { Divider } from 'react-native-elements';

const ITEM_HEIGHT = 50;

export const HomeLivreurScreen = ({ navigation }) => {

    const ref = React.useRef(null);
    const [list, setlist] = React.useState([]);
    const [grps, setgroupes] = React.useState({});
    const [isloading, setisloading] = React.useState(false)
    const Consts = Colors;
    const [state, setstate] = React.useState(2);

    const keyExtractor = React.useCallback(item => item.id, []);
    const getItemLayout = React.useCallback((data, index) => (
        { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
    ), []);

    const __ = async () => {
        setisloading(true)
        onRunExternalRQST({
            method: "GET",
            url: `/commandes/list/bystate/${state}?page_size=100&page_number=1`
        }, (err, done) => {
            setisloading(false)
            if (done) {
                const { status, message, data } = done;
                if (status === 200) {
                    const { rows, length, groupes } = data;
                    setlist(rows)
                    setgroupes(groupes)
                } else {
                    setlist([])
                    setisloading(false)
                    Snackbar.show({
                        text: "Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.dangerColor
                    });
                }
            } else {
                Snackbar.show({
                    text: "Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer",
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Colors.dangerColor
                });
            }
        })
    }

    const RenderItem = React.memo(({ item }) => {

        const { transaction, prix_unit, prix_total, qte, currency, payament_phone, state, __tbl_ecom_produit, __tbl_ecom_typelivraison, __tbl_ecom_user, __tbl_ecom_unitesmesure, createdAt } = item;
        const { produit, image, description } = __tbl_ecom_produit;
        const { type, lieux, frais_livraison } = __tbl_ecom_typelivraison;
        const { unity } = __tbl_ecom_unitesmesure;
        const { nom, postnom, prenom, phone, email } = __tbl_ecom_user;
        const { name, color } = renderState({ state })

        return (
            <TouchableHighlight
                underlayColor={Colors.pillColor}
                onPress={() => {
                    navigation.navigate(routes['detailscommande'], { item, group: grps && grps[transaction] ? grps[transaction] : [] })
                }}
            >
                <View style={{ marginTop: 10, backgroundColor: Colors.pillColor }}>
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end", alignContent: "center", alignItems: "center" }}>
                        <Text style={{ fontFamily: "mons-b", fontSize: 14, color: color }}>
                            {name}
                        </Text>
                        <Entypo name='bookmark' color={color} size={45} />
                    </View>
                    <View style={{ width: "100%", padding: 20, backgroundColor: Colors.pillColor, elevation: 5, marginTop: 2, flexDirection: "row", alignItems: "center" }}>
                        <View style={{ width: "90%" }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: 20 }}>ID: <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{transaction}</Text></Text>
                                <View>
                                    <Text style={{ fontFamily: "mons-e", fontSize: 14 }}>Date de commande</Text>
                                    <Text style={{ fontFamily: "mons-b", fontSize: 14 }}>{createdAt}</Text>

                                </View>
                            </View>
                            <Divider />
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View style={{ marginTop: 10, width: "50%" }}>
                                    <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Produit: <Text style={{ fontFamily: "mons-b" }}>{produit || "---"}</Text></Text>
                                    <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Prix unitaire: <Text style={{ fontFamily: "mons-b" }}>{prix_unit}{currency}</Text></Text>
                                    <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Quantité comm.: <Text style={{ fontFamily: "mons-b" }}>{qte}{unity || "---"}</Text></Text>
                                    <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Prix total: <Text style={{ fontFamily: "mons-b", color: Colors.dangerColor }}>{prix_total}{currency || "---"}</Text></Text>
                                </View>
                                <View style={{ marginTop: 10, width: "50%" }}>
                                    <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Type livr.: <Text style={{ fontFamily: "mons-b" }}>{type}</Text></Text>
                                    <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Lieu livr.: <Text style={{ fontFamily: "mons-b" }}>{lieux || "---"}</Text></Text>
                                    <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Client: <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{nom} {postnom}</Text></Text>
                                    <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Contact: <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{phone}</Text></Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ width: "10%", alignContent: "center", alignItems: "center", backgroundColor: Colors.pillColor, flexDirection: "column" }}>
                            <Entypo name="chevron-right" size={24} color={Colors.primaryColor} />
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    })

    React.useEffect(() => {
        __()
    }, [])

    return (
        <>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.primaryColor} />
            <View
                style={{ paddingBottom: 20, backgroundColor: Consts.primaryColor }}
            >
                <View style={{ height: 190, paddingBottom: 5 }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ width: "70%", padding: 12, height: "auto" }}>
                            <TouchableHighlight
                                underlayColor={"transparent"}
                                onPress={() => {
                                    navigation.navigate(routes['profilelivreur'])
                                }}
                            >
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: 25, color: Consts.whiteColor, fontFamily: "mons", textTransform: "capitalize" }}>
                                        {appname} | <Text style={{ fontFamily: "mons-e" }}>Livreur</Text>
                                    </Text>
                                </View>
                            </TouchableHighlight>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="calendar" color={Consts.whiteColor} style={{ paddingRight: 7 }} />
                                <Text style={{ color: Consts.whiteColor, fontFamily: "mons-e", fontSize: 18 }}>{now()}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MaterialIcons name="power-input" color={Consts.whiteColor} style={{ paddingRight: 7 }} />
                                <Text style={{ color: Consts.whiteColor, fontFamily: "mons-e", fontSize: 18 }}>Compte actif</Text>
                            </View>
                        </View>
                        <View style={{ width: "30%", alignContent: "flex-end", alignItems: "flex-end", padding: 8 }}>
                            <TouchableHighlight
                                underlayColor={Consts.primaryColor}
                                style={{ borderRadius: 12, alignItems: "center", padding: 0, alignContent: "center", justifyContent: "center" }}
                                onPress={_ => {
                                    __()
                                }}>
                                <Ionicons name="refresh-circle" size={62} color={Consts.whiteColor} style={{ padding: 12 }} />
                            </TouchableHighlight>
                        </View>
                    </View>
                    <TouchableHighlight
                        underlayColor={"transparent"}
                        onPress={() => {
                            navigation.navigate(routes['aboutapp'])
                        }}
                    >
                        <View style={{ width: "95%", alignSelf: "center", borderTopColor: Consts.pillColor, borderTopWidth: .6, flexDirection: "row", justifyContent: "center" }}>
                            <View style={{ width: "80%", paddingHorizontal: 5, marginTop: 6 }}>
                                <View style={{ marginTop: 10, alignContent: "center" }}>
                                    <Text style={{ fontFamily: "mons-e", color: Consts.pillColor, textAlign: "center" }}>Commandes livrables</Text>
                                    <Text style={{ fontFamily: "mons", color: Consts.pillColor, textAlign: "center", fontSize: 23 }}>{list.length} commande ( s )</Text>
                                </View>
                            </View>
                            {/* <View style={{ width: "50%", paddingHorizontal: 5, marginTop: 6, borderLeftWidth: .6, borderLeftColor: Consts.pillColor }}>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontFamily: "mons-e", color: Consts.pillColor, textAlign: "center" }}>Toutes les commandes</Text>
                                    <Text style={{ fontFamily: "mons", color: Consts.whiteColor, textAlign: "center" }}>
                                        {list.length}
                                    </Text>
                                </View>
                            </View> */}
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
            <View style={{ width: "100%", paddingHorizontal: 10, backgroundColor: Colors.whiteColor }}>
                <FlatList
                    contentContainerStyle={{ paddingBottom: "110%" }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<EmptyList />}
                    refreshControl={<RefreshControl
                        colors={[Colors.primaryColor]}
                        refreshing={isloading}
                        onRefresh={__}
                    />}
                    getItemLayout={getItemLayout}
                    keyExtractor={keyExtractor}
                    data={list}
                    renderItem={({ item }) => <RenderItem item={item} />}
                />
            </View>
            <DialogBox ref={ref} isOverlayClickClose={false} />
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