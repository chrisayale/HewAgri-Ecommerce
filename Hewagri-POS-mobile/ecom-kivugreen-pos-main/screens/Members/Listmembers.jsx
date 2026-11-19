import * as React from 'react'
import { Title } from '../../components/Title/Title'
import { FlatList, RefreshControl, ScrollView, Text, View } from 'react-native'
import { onRunExternalRQST } from '../../services/communications';
import Snackbar from 'react-native-snackbar';
import { Colors } from '../../assets/colors/Colors';
import { Loader } from '../../components/Loader/comp.loader';
import { Divider } from 'react-native-elements';
import { formatDate, randomLongNumber, trucString, unixToDate } from '../../assets/helper/helper.all';
import { Entypo } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { handleSearch } from 'dm-handlesearch';
import { EmptyList } from '../../components/Emptylist/com.emptylist';
import Spinner from 'react-native-loading-spinner-overlay';
import DialogBox from 'react-native-dialogbox';
import { TouchableHighlight } from 'react-native';
import { Dims } from '../../assets/dimensions/Dimemensions';

const ITEM_HEIGHT = 50;

export const Memberslist = ({ route, navigation }) => {
    const [list, setlist] = React.useState([]);
    const [temps, settemps] = React.useState([]);
    const [keyword, setkeyword] = React.useState("");
    const [isloading, setisloading] = React.useState(false);
    const { idcooperative, user, token } = global;
    const ref = React.useRef();

    const keyExtractor = React.useCallback(item => item.id.toString(), []);
    const getItemLayout = React.useCallback((data, index) => (
        { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
    ), []);

    const RenderItem = React.memo(({ item }) => {
        try {
            if (!item || !item.__tbl_ecom_hasmembers) return null;
            const { __tbl_ecom_hasmembers, email, id, nom, postnom, phone, prenom } = item || {};
            const { carte, createdAt, date_expiration, date_expiration_unix, id: asid, updatedAt } = __tbl_ecom_hasmembers || {};

            return (
                <TouchableHighlight
                    underlayColor={"transparent"}
                    onPress={() => {
                        ref.current.tip({
                            title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Informations sur le membre </Text>,
                            content: [<View style={{ width: 250 }}>
                                <View style={{ flexDirection: "column", width: "100%" }}>
                                    <View>
                                        <Text style={{ fontFamily: "mons-e", fontSize: 13 }}>ID Membre:
                                            <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{" "}{`${asid || "---"}`}</Text>
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontFamily: "mons-e", fontSize: 14 }}>Membre depuis</Text>
                                        <Text style={{ fontFamily: "mons-b", fontSize: 14 }}>{`${createdAt} || "---"`}</Text>
                                        <View style={{ marginTop: 10, width: "100%" }}>
                                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Nom: <Text style={{ fontFamily: "mons-b" }}>{`${nom || "---"}`}</Text></Text>
                                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Postnom: <Text style={{ fontFamily: "mons-b" }}>{`${postnom || "---"}`}</Text></Text>
                                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Prenom: <Text style={{ fontFamily: "mons-b" }}>{`${prenom || "---"}`}</Text></Text>
                                        </View>
                                        <View style={{ marginTop: 10, width: "100%" }}>
                                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Téléphone: <Text style={{ fontFamily: "mons-b" }}>{`${phone}`}</Text></Text>
                                            <Text style={{ fontFamily: "mons-e", fontSize: 11 }}>Email: <Text style={{ fontFamily: "mons-b" }}>{`${trucString({ nomItem: email, longueurMax: 20 }) || "---"}`}</Text></Text>
                                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Date d'expiration: <Text style={{ fontFamily: "mons-b", color: Colors.dangerColor }}>{`${date_expiration || "---"}`}</Text></Text>
                                        </View>
                                    </View>
                                </View>
                            </View>],
                            btn: {
                                text: 'OK',
                                style: {
                                    color: Colors.primaryColor,
                                    fontFamily: 'mons'
                                }
                            }
                        });
                    }}
                >
                    <View style={{ width: "100%", padding: 20, backgroundColor: Colors.pillColor, elevation: 3, borderRadius: 10, marginTop: 15, flexDirection: "column", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <View>
                                <Text style={{ fontFamily: "mons-e", fontSize: 13 }}>ID Membre:
                                    <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{" "}{`${asid || "---"}`}</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={{ width: "100%" }}>
                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Nom complet <Text style={{ fontFamily: "mons-b" }}>{`${nom || "---"} ${postnom || "---"} ${prenom || "---"}`}</Text></Text>
                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Téléphone: <Text style={{ fontFamily: "mons-b" }}>{`${phone || "---"}`}</Text></Text>
                            {/* <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Prenom: <Text style={{ fontFamily: "mons-b" }}>{`${prenom || "---"}`}</Text></Text> */}
                        </View>
                        {/* <Divider />
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ marginTop: 10, width: "40%" }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Nom: <Text style={{ fontFamily: "mons-b" }}>{`${nom || "---"}`}</Text></Text>
                                <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Postnom: <Text style={{ fontFamily: "mons-b" }}>{`${postnom || "---"}`}</Text></Text>
                                <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Prenom: <Text style={{ fontFamily: "mons-b" }}>{`${prenom || "---"}`}</Text></Text>
                            </View>
                            <View style={{ marginTop: 10, width: "60%" }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Télé.: <Text style={{ fontFamily: "mons-b" }}>{`${phone}`}</Text></Text>
                                <Text style={{ fontFamily: "mons-e", fontSize: 11 }}>Email: <Text style={{ fontFamily: "mons-b" }}>{`${trucString({ nomItem: email, longueurMax: 20 }) || "---"}`}</Text></Text>
                                <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Exp.: <Text style={{ fontFamily: "mons-b", color: Colors.dangerColor }}>{`${unixToDate({ unix: date_expiration_unix }) || "---"}`}</Text></Text>
                            </View>
                        </View> */}
                    </View>
                </TouchableHighlight>

            )
        } catch (error) {
            return <Text style={{ color: Colors.dangerColor }}>{error.toString()}</Text>
        }
    })

    const __onSearch = async ({ k }) => {
        handleSearch({
            rows: temps,
            columns: ['nom', 'postnom', 'phone', 'prenom'],
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
            url: `/cooperatives/cooperative/${idcooperative}`
        }, (err, done) => {
            setisloading(false)
            if (done) {
                const { status, message, data } = done;
                if (status === 200) {
                    const { __tbl_ecom_users } = data || {};
                    setlist(__tbl_ecom_users || [])
                    settemps(__tbl_ecom_users || [])
                } else {
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
                settemps([])
                Snackbar.show({
                    text: "Erreur de chargement veuillez réessayez encore",
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Colors.dangerColor
                });
            }
        })
    }

    React.useEffect(() => {
        __onLoad()
    }, [])

    return (
        <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
            <Title navigation={navigation} title={`Membres | nombre des membres ( ${temps.length} )`} subtitle={"Liste des membres"} />
            <View style={{ flexDirection: "column", alignSelf: "center", width: "100%", paddingTop: 8, paddingHorizontal: 12, backgroundColor: Colors.primaryColor }}>
                <View style={{
                    flexDirection: "column",
                    marginTop: 8,
                    marginBottom: 20,
                    alignContent: "center",
                    alignItems: "center"
                }}>
                    <TextInput
                        placeholder="ex: Daudi"
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
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: "100%" }}
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
                    renderItem={({ item, index }) => <RenderItem
                        item={item}
                        key={index}
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
            <DialogBox ref={ref} isOverlayClickClose={false} />
        </View>
    )
}