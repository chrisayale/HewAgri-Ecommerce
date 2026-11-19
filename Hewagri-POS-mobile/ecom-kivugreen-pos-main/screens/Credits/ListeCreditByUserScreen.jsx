import React from "react";
import { onRunExternalRQST } from "../../services/communications";
import { Colors } from "../../assets/colors/Colors";
import { FlatList, RefreshControl, Text, TextInput, TouchableHighlight, View } from "react-native";
import { Title } from "../../components/Title/Title";
import { handleSearch } from "dm-handlesearch";
import { EmptyList } from "../../components/Emptylist/com.emptylist";
import { routes } from "../../assets/helper/helper.routes";
import { Entypo } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import { Dims } from "../../assets/dimensions/Dimemensions";
import { formatDate, randomString, returnStatus, trucString } from "../../assets/helper/helper.all";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import DialogBox from 'react-native-dialogbox';
import Snackbar from "react-native-snackbar";

export const ListeCreditsByUserScreen = ({ navigation, route }) => {
    const [keyword, setkeyword] = React.useState("")
    const [temps, settemps] = React.useState([])
    const [list, setlist] = React.useState([])
    const [isloading, setisloading] = React.useState(false)
    const { num_enregistrement, phone, sigle, cooperative, adresse, __tbl_ecom_users, id: idcooperative } = global.coopec || {}
    const [step, setstep] = React.useState(0);
    const ref = React.useRef();

    const { params } = route
    const { item, id_user } = params

    const tabs = [
        {
            name: 'En attente',
            key: 0,
            content: (
                <>
                    <EmptyList />
                </>
            )
        },
        {
            name: 'Déjà validées',
            key: 1,
            content: (
                <>
                    <EmptyList />
                </>
            )
        }
    ];

    const __onSearch = async ({ k }) => {
        handleSearch({
            rows: temps,
            columns: ['membre', 'produit'],
            keyword: k,
            cb: ({ rows, length }) => {
                setlist(rows)
            }
        })
    }

    const __onLoad = async ({ status }) => {
        setisloading(true)
        onRunExternalRQST({
            method: "GET",
            url: `/credits/bymember/${id_user}/${status}`
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
                settemps([])
                setlist([])
                Snackbar.show({
                    text: "Erreur de chargement veuillez réessayez encore",
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Colors.dangerColor
                });
            }
        })
    }

    const RenderItem = React.memo(({ item }) => {

        const { createdat, montant, currency, motif, periode_remboursement, __tbl_ecom_cooperative = {}, __tbl_ecom_user = {}, __tbl_ecom_bank = {}, status } = item
        const { logo, adresse, phone, email, num_enregistrement, sigle, cooperative } = __tbl_ecom_cooperative || {}
        const { nom, avatar, postnom, prenom, phone: as_user_phone, email: as_email_user, date_naiss, sexe, id } = __tbl_ecom_user || {}
        const { bank, email: as_email_bank, phone: as_back_phone, email: as_bank_email } = __tbl_ecom_bank || {}

        return (
            <TouchableHighlight
                key={randomString({ length: 32 })}
                underlayColor={Colors.whiteColor}
                onPress={() => {
                    navigation.navigate(routes['detailscredit'], { item })
                }}
            >
                <>
                    <View style={{ width: "100%", flexDirection: "row", alignContent: "center", alignItems: "center", alignSelf: "center", justifyContent: "center", overflow: "hidden", borderRadius: 10, padding: 5, backgroundColor: Colors.pillColor }}>
                        <View style={{ width: "90%" }}>
                            <View style={{ flexDirection: "column", padding: 10, backgroundColor: Colors.pillColor }}>
                                <>
                                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                                        <View style={{ width: "60%" }}>
                                            <Text style={{ color: Colors.darkColor, fontFamily: "mons-e" }}>Montant</Text>
                                            <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{montant} {currency}</Text>
                                        </View>
                                        <View style={{ width: "38%" }}>
                                            <Text style={{ color: Colors.darkColor, fontFamily: "mons-e" }}>Date de création.</Text>
                                            <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize - 4 }}>{formatDate({ date: createdat })}</Text>

                                        </View>
                                    </View>
                                </>
                                <>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ fontFamily: "mons-e" }}>Motif de la démande</Text>
                                        <View>
                                            <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{trucString({ longueurMax: 30, nomItem: motif })}</Text>
                                        </View>
                                    </View>
                                </>
                                <>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ fontFamily: "mons-e" }}>Etat de la démande</Text>
                                        <View>
                                            <Text style={{ color: status ? Colors.primaryColor : Colors.darkColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{returnStatus({ status })}</Text>
                                        </View>
                                    </View>
                                </>
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
    })

    React.useEffect(() => {
        __onLoad({ status: step })
    }, []);

    return (
        <>
            <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }} >
                <Title title={`Liste crédits ${item.nom || "---"}`} subtitle={`Liste de démandes des crédits ${item.nom || "---"}`} navigation={navigation} />
                <View style={{ flexDirection: "column", alignSelf: "center", width: "100%", paddingTop: 8, paddingHorizontal: 12, backgroundColor: Colors.primaryColor, height: 180 }}>
                    <View style={{
                        flexDirection: "column",
                        marginTop: 8,
                        marginBottom: 20,
                        alignContent: "center",
                        alignItems: "center"
                    }}>
                        <View style={{ width: "100%", alignContent: "center", alignItems: "center", justifyContent: "center", alignSelf: "center", height: "auto", paddingVertical: 10, backgroundColor: Colors.pillColor, marginBottom: 10, borderRadius: 10 }}>
                            <Text style={{ fontFamily: "mons", color: Colors.primaryColor }}>
                                <Text style={{ fontFamily: "mons-e" }}>Nom du membre : </Text>
                                {item.nom || ""}
                            </Text>
                            <Text style={{ fontFamily: "mons", color: Colors.primaryColor }}>
                                <Text style={{ fontFamily: "mons-e" }}>Postnom : </Text>
                                {item.postnom || ""}
                            </Text>
                            <Text style={{ fontFamily: "mons", color: Colors.primaryColor }}>
                                <Text style={{ fontFamily: "mons-e" }}>Téléphone : </Text>
                                {item.phone || ""}
                            </Text>
                        </View>
                        <View style={{ width: "100%", alignSelf: "center", flex: 1, zIndex: 100, flexDirection: "column", marginTop: 0 }}>
                            <SegmentedControl
                                tintColor={Colors.whiteColor}
                                style={{
                                    height: 60,
                                    elevation: 20
                                }}
                                backgroundColor={Colors.primaryColor}
                                fontStyle={{
                                    fontFamily: "mons-e",
                                    color: Colors.whiteColor,
                                    fontSize: Dims.bigtitletextsize - 10
                                }}
                                onValueChange={(v) => { }}
                                tabStyle={{
                                    height: 90,
                                    borderRadius: Dims.borderradius,
                                }}
                                appearance='light'
                                activeFontStyle={{
                                    fontFamily: "mons-e",
                                    color: Colors.primaryColor,
                                }}
                                values={[...Array.from(tabs).map(t => t['name'])]}
                                selectedIndex={step}
                                onChange={(event) => {
                                    const { nativeEvent } = event;
                                    const { selectedSegmentIndex } = nativeEvent;
                                    setstep(selectedSegmentIndex)
                                    __onLoad({ status: selectedSegmentIndex })
                                }}
                                activeStyle={{ borderRadius: 40 }}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 10, marginVertical: 10 }}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: "100%" }}
                        data={list}
                        keyExtractor={(item, index) => item['id']}
                        renderItem={({ item }) => <RenderItem item={item} />}
                        ListEmptyComponent={<EmptyList />}
                        refreshControl={<RefreshControl
                            refreshing={isloading}
                            onRefresh={() => __onLoad({ status: step })}
                            colors={[Colors.primaryColor]}
                        />}
                    />
                </View>
            </View>
            <DialogBox ref={ref} isOverlayClickClose={false} />
        </>
    )
}