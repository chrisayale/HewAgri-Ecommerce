import * as React from 'react'
import { Colors } from '../../assets/colors/Colors'
import { FlatList, RefreshControl, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { Title } from '../../components/Title/Title'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { btn } from '../../assets/styles/Styles'
import { routes } from '../../assets/helper/helper.routes'
import { Divider } from 'react-native-elements'
import { Dims } from '../../assets/dimensions/Dimemensions'
import { formatDate, randomString } from '../../assets/helper/helper.all'
import { onRunExternalRQST } from '../../services/communications'
import Snackbar from 'react-native-snackbar'
import { EmptyList } from '../../components/Emptylist/com.emptylist'
import { handleSearch, asyncSearch } from 'dm-handlesearch'
import Spinner from 'react-native-loading-spinner-overlay'

export const StockScreen = ({ navigation, route }) => {
    const [keyword, setkeyword] = React.useState("")
    const [list, setlist] = React.useState([])
    const [temps, settemps] = React.useState([])
    const [isloading, setisloading] = React.useState(false)
    const { idcooperative, user, token } = global;
    const { nom, postnom, phone } = user;

    const __onSearch = async ({ k }) => {
        handleSearch({
            rows: temps,
            columns: ['transaction'],
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
            url: `/stocks/stock/${idcooperative}`
        }, (errr, done) => {
            setisloading(false)
            if (done) {
                const { data, message, status } = done
                if (status === 200) {
                    const { rows, } = data
                    setlist(rows)
                    settemps(rows)
                } else {
                    setlist([])
                    settemps([])
                    Snackbar.show({
                        text: "Erreur de chargement veuillez réessayez encore",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.dangerColor
                    });
                }
            } else {
                settemps(rows)
                setlist([])
                Snackbar.show({
                    text: "Erreur de chargement veuillez réessayez encore",
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Colors.dangerColor
                });
            }
        })
    }

    const renderItem = ({ item }) => {
        const { transaction, description, createdAt, __tbl_ecom_hasproducts, __tbl_ecom_categories, __tbl_ecom_produits } = item

        return (
            <TouchableHighlight
                key={randomString({ length: 32 })}
                underlayColor={Colors.whiteColor}
                onPress={() => {
                    navigation.navigate(routes['storagedetails'], { item })
                }}
            >
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
                                        <Text style={{ color: Colors.darkColor, fontFamily: "mons-e" }}>Date</Text>
                                        <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize - 4 }}>{formatDate({ date: createdAt })}</Text>
                                    </View>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontFamily: "mons-e" }}>Produits ( {Array.from(__tbl_ecom_produits).length} )</Text>
                                    <View>
                                        {Array.from(__tbl_ecom_produits).map((prd, index) => {
                                            const { produit, __tbl_ecom_hasproducts, __tbl_ecom_unitesmesures } = prd;
                                            const { unity } = __tbl_ecom_unitesmesures;
                                            const { qte, prix_unitaire, currency } = __tbl_ecom_hasproducts
                                            return (
                                                <View style={{}} key={index}>
                                                    <Text style={{ fontFamily: "mons", fontSize: 12 }}>{produit} | Qte. : {qte}{unity} | Prix :{prix_unitaire}{currency} </Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ width: "10%", alignContent: "center", alignItems: "center", backgroundColor: Colors.pillColor }}>
                            <Entypo name="chevron-right" size={24} color={Colors.primaryColor} />
                        </View>
                    </View>
                    <View style={{ width: "100%", marginVertical: 10 }}>
                        <Divider />
                    </View>
                </>
            </TouchableHighlight>
        )
    }

    React.useEffect(() => {
        __onLoad()
    }, []);

    return (
        <>
            <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }} >
                <Title title={"Stock"} subtitle={"Liste des produits disponibles dans le stock"} navigation={navigation} />
                <View style={{ flexDirection: "column", alignSelf: "center", width: "100%", paddingTop: 8, paddingHorizontal: 12, backgroundColor: Colors.primaryColor }}>
                    <View style={{
                        flexDirection: "column",
                        marginTop: 8,
                        marginBottom: 20,
                        alignContent: "center",
                        alignItems: "center"
                    }}>
                        <TextInput
                            placeholder="ID Transaction"
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
                        {/* <TouchableHighlight
                            underlayColor={Colors.pillColor}
                            style={[btn, { backgroundColor: Colors.whiteColor, marginVertical: 20, elevation: 8 }]}
                            onPress={__onSearch}
                        >
                            <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center", paddingVertical: 5, height: 48 }}>
                                <Ionicons name='search' color={Colors.primaryColor} size={25} />
                                <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor, paddingLeft: 12 }}>Chercher</Text>
                            </View>
                        </TouchableHighlight> */}
                    </View>
                </View>
                <View style={{ paddingHorizontal: 10, marginVertical: 10 }}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: "100%" }}
                        data={list}
                        keyExtractor={(item, index) => item['id']}
                        renderItem={renderItem}
                        ListEmptyComponent={<EmptyList />}
                        refreshControl={<RefreshControl
                            refreshing={isloading}
                            onRefresh={__onLoad}
                            colors={[Colors.primaryColor]}
                        />}
                    />
                </View>
                {/* <Spinner
                    overlayColor='rgba(0,0,0,.9)'
                    visible={isloading}
                    size={100}
                    color={Colors.primaryColor}
                    textContent={<View style={{ flexDirection: "column", alignContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 25, fontFamily: "mons", color: Colors.primaryColor }}>Chargement en cours</Text>
                        <Text style={{ fontFamily: "mons-e", color: Colors.primaryColor }}>Envoie de la requête de connexion en cours veuillez pationtez</Text>
                    </View>}
                    textStyle={{
                        alignSelf: "center",

                    }}
                /> */}
            </View>
        </>
    )
}