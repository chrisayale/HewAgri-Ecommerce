import * as React from 'react'
import { Title } from '../../components/Title/Title'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { onRunExternalRQST } from '../../services/communications';
import Snackbar from 'react-native-snackbar';
import { Colors } from '../../assets/colors/Colors';
import { Loader } from '../../components/Loader/comp.loader';
import { Divider } from 'react-native-elements';
import { formatDate, groupedDataByColumn, renderState, unixToDate } from '../../assets/helper/helper.all';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { handleSearch } from 'dm-handlesearch';
import { EmptyList } from '../../components/Emptylist/com.emptylist';
import { TouchableHighlight } from 'react-native';
import { routes } from '../../assets/helper/helper.routes';
import Spinner from 'react-native-loading-spinner-overlay';

const ITEM_HEIGHT = 50;

export const CommandeslisteScreen = ({ route, navigation }) => {
    const [list, setlist] = React.useState([]);
    const [temps, settemps] = React.useState([]);
    const [keyword, setkeyword] = React.useState("");
    const [isloading, setisloading] = React.useState(false);
    const { idcooperative, user, token } = global;
    const keyExtractor = React.useCallback(item => item.id, []);

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
                    navigation.navigate(routes['detailscommande'], { item, group: [], id_transaction: transaction })
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
                                <Text style={{ fontFamily: "mons-e", fontSize: 14 }}>ID: <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{transaction}</Text></Text>
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
                                    <Text style={{ fontFamily: "mons-e", fontSize: 10 }}>Type livr.: <Text style={{ fontFamily: "mons-b" }}>{type}</Text></Text>
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

    const __onSearch = async ({ k }) => {
        handleSearch({
            rows: temps,
            columns: ['payament_phone', 'transaction'],
            keyword: k,
            cb: ({ rows, length }) => {
                setlist(rows)
            }
        })
    }

    const __onLoad = async () => {
        setisloading(true)
        onRunExternalRQST({
            method: "GET",
            url: `/commandes/list/bycooperative/${idcooperative}`
        }, (err, done) => {
            setisloading(false)
            if (done) {
                const { status, message, data } = done;
                if (status === 200) {
                    const { rows, length, groupes: __ } = data;
                    setlist(rows || [])
                    settemps(rows || [])
                    // setgroupes(__)
                } else {
                    // setgroupes({})
                    settemps([])
                    setlist([])
                    Snackbar.show({
                        text: "Erreur de chargement veuillez réessayez encore",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.dangerColor
                    });
                }
            } else {
                setlist([])
                Snackbar.show({
                    text: "Erreur de chargement veuillez réessayez encore",
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Colors.dangerColor
                });
            }
        })
    }

    const getItemLayout = React.useCallback((data, index) => (
        { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
    ), []);

    React.useEffect(() => {
        __onLoad()
    }, [])

    return (
        <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
            <Title navigation={navigation} title={`Commandes ( ${temps.length} )`} subtitle={"Liste des commandes en cours"} />
            <View style={{ flexDirection: "column", alignSelf: "center", width: "100%", paddingTop: 8, paddingHorizontal: 12, backgroundColor: Colors.primaryColor }}>
                <View style={{
                    flexDirection: "column",
                    marginTop: 8,
                    marginBottom: 20,
                    alignContent: "center",
                    alignItems: "center"
                }}>
                    <TextInput
                        placeholder="ex: ID Transaction"
                        value={keyword}
                        maxLength={60}
                        returnKeyType="next"
                        onChangeText={text => {
                            setkeyword(text);
                            __onSearch({ k: text })
                        }}
                        style={{
                            backgroundColor: Colors.whiteColor,
                            paddingHorizontal: 20,
                            height: 56,
                            borderRadius: 5,
                            fontFamily: "mons-b",
                            width: "100%",
                            // borderWidth: 1,
                            color: Colors.primaryColor
                        }}
                    />
                </View>
            </View>
            <View style={{ width: "100%", paddingHorizontal: 10 }}>
                <FlatList
                    contentContainerStyle={{ paddingBottom: "50%" }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<EmptyList />}
                    getItemLayout={getItemLayout}
                    keyExtractor={keyExtractor}
                    initialNumToRender={10}
                    windowSize={5}
                    refreshControl={<RefreshControl
                        colors={[Colors.primaryColor]}
                        refreshing={isloading}
                        onRefresh={__onLoad}
                    />}
                    data={list}
                    renderItem={({ item }) => <RenderItem item={item} />}

                />
            </View>
            {/* <Spinner
                overlayColor='rgba(0,0,0,.9)'
                visible={isloading}
                size={100}
                color={Colors.primaryColor}
                textContent={<View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", width: "90%" }}>
                    <Text style={{ fontSize: 25, fontFamily: "mons", color: Colors.primaryColor }}>Chargement en cours</Text>
                    <Text style={{ fontFamily: "mons-e", color: Colors.primaryColor }}>Envoie de la requête ...</Text>
                </View>}
                textStyle={{
                    alignSelf: "center",

                }}
            /> */}
        </View>
    )
}