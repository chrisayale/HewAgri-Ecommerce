import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, FlatList, RefreshControl, Keyboard } from 'react-native';
import DialogBox from 'react-native-dialogbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../assets/colors/Colors';
import { Title } from '../../components/Title/Title';
import { Footer } from '../../components/Footer/comp.footer';
import { onRunExternalRQST } from '../../services/communications';
import Toast from 'react-native-toast-message';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { btn } from '../../assets/styles/Styles';

export const Searchscreen = ({ navigation, route }) => {
    const kwd = route['params']['keyword'];

    const [keyword, setkeyword] = React.useState(kwd);
    const [borderdanger, setborderdanger] = React.useState(false);
    const [loading, setloading] = React.useState(false);
    const [results, setresults] = React.useState([]);
    const dialogbox = React.useRef(null);
    const Consts = Colors;

    const onSearch = async () => {
        if (keyword.length >= 1 || kwd) { // ? keyword : ""
            const k = keyword.toString().length > 0 ? keyword.toString() : kwd
            setloading(true)
            setborderdanger(false);
            Keyboard.dismiss();
            await onRunExternalRQST({
                url: `/permis/list/search?keyword=${k}`,
                method: "GET"
            }, (err, done) => {
                if (done) {
                    setloading(false)
                    const { status, data, message } = done;
                    if (status === 200) {
                        const { list, length } = data;
                        setresults(list)
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Elément non trouvé',
                            text2: 'Nous sommes dans l\'incapiciter des fournir ces informations pour l\'instant !',
                        });
                    }
                } else {
                    setloading(false)
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Une erreur est survenue lors de la recherche des informations sur le serveur !',
                    });
                }
            })
        } else {
            setborderdanger(true);
        }
    }

    React.useEffect(() => {
        setborderdanger(false)
        onSearch();
    }, [])

    const renderItem = ({ item }) => {
        const { isvalidated, perminumber, ordernumber, createdon, __tbl_member } = item;
        const { nom, postnom, prenom, phone, mname, email } = __tbl_member;
        return (
            <TouchableHighlight
                underlayColor={Consts.pillColor}
                style={{
                    elevation: 5,
                    backgroundColor: Colors.pillColor,
                    borderTopColor: Consts.primaryColor,
                    borderTopWidth: 3
                }}
                onPress={(e) => {
                    dialogbox.current.confirm({
                        title: <Text style={{ fontFamily: "mons", fontSize: 17, color: Colors.primaryColor }}>Permis | {perminumber}</Text>,
                        content: [<Text style={{ fontFamily: "mons", fontSize: 13 }} >permis <Text style={{ color: Colors.primaryColor }}>{item['code_permi']}</Text>, appartenant {`\n`} à {nom} {postnom}</Text>],
                        ok: {
                            text: "Afficher",
                            style: {
                                fontFamily: "mons-b",
                                color: Consts.primaryColor
                            },
                            callback: () => navigation.navigate("displaydatareaded", { data: perminumber, type: null, target: null, alldata: item })
                        },
                        cancel: {
                            text: "Ecrire dans une carte",
                            style: {
                                fontFamily: "mons-b",
                                color: Consts.darkColor
                            },
                            callback: () => navigation.replace("ncfwriter", { data: item['code_permi'], type: null, target: null, alldata: item })
                        }
                    })
                    //
                }}
            >
                <View style={{ width: "100%", paddingHorizontal: 12, backgroundColor: Consts.pillColor, marginBottom: 12, minHeight: 56, paddingVertical: 12 }}>
                    <Text style={{ color: Consts.primaryColor, fontSize: 15, paddingBottom: 15, fontFamily: "mons-b" }}>Numéro permi : {perminumber}</Text>
                    <Text style={{ fontFamily: "mons-e" }}>Nom : <Text style={{ color: Consts.darkColor, fontFamily: "mons-b", textTransform: "capitalize" }}>{nom}</Text></Text>
                    <Text style={{ fontFamily: "mons-e" }}>Postnom : <Text style={{ color: Consts.darkColor, fontFamily: "mons-b", textTransform: "capitalize" }}>{postnom}</Text></Text>
                </View>
            </TouchableHighlight>
        )
    }

    return (
        <>
            <Title title={"Recherche par mot clé"} navigation={navigation} subtitle={"Recherche permis par mot clé"} />
            <View>
                <View style={{ flexDirection: "column", alignSelf: "center", width: "100%", paddingTop: 8, paddingHorizontal: 12, backgroundColor: Consts.primaryColor }}>
                    <View style={{
                        flexDirection: "column",
                        marginTop: 8,
                        alignContent: "center",
                        alignItems: "center"
                    }}>
                        <TextInput
                            placeholder="ex: P1..."
                            value={keyword}
                            maxLength={60}
                            returnKeyType="next"
                            onChangeText={text => setkeyword(text)}
                            style={{
                                backgroundColor: Consts.whiteColor,
                                paddingHorizontal: 20,
                                height: 56,
                                borderRadius: 5,
                                fontFamily: "mons-b",
                                width: "100%",
                                borderColor: borderdanger ? Consts.dangerColor : Consts.whiteColor,
                                borderWidth: 1,
                                color: Consts.primaryColor
                            }}
                        />
                        <TouchableHighlight
                            underlayColor={Consts.pillColor}
                            style={[btn, { backgroundColor: Consts.whiteColor, marginVertical: 20 }]}
                            onPress={onSearch}
                        >
                            <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center", paddingVertical: 5, height: 48 }}>
                                <Ionicons name='search' color={Consts.primaryColor} size={25} />
                                <Text style={{ fontFamily: "mons-b", color: Consts.primaryColor, paddingLeft: 12 }}>Chercher</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={{ paddingBottom: 42, paddingHorizontal: 12, marginTop: 12 }}>
                    <Text style={{ fontFamily: "mons-b", color: Consts.primaryColor, paddingBottom: 30 }}>Resultats de recherche </Text>
                    <FlatList
                        ListEmptyComponent={() => (
                            <View style={{ justifyContent: "center", padding: 12 }}>
                                <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "column", paddingVertical: 30 }}>
                                    <Text style={{ fontFamily: "mons-b", color: Consts.primaryColor }}>Aucune information pour l'instant</Text>
                                    <Text style={{ fontFamily: "mons-e", color: Consts.dark }}>Tirez vers le bas pour actualiser</Text>
                                    <Ionicons name='file-tray-outline' size={Dims.bigiconsize * 1.5} color={Consts.primaryColor} style={{ marginTop: 25 }} />
                                </View>
                            </View>
                        )}
                        style={{ marginBottom: 155, paddingBottom: 150 }}
                        contentContainerStyle={{ marginBottom: 200, paddingBottom: 400 }}
                        showsVerticalScrollIndicator={true}
                        refreshControl={
                            <RefreshControl
                                onRefresh={onSearch}
                                refreshing={loading}
                                colors={[Consts.primaryColor, Consts.dangerColor, Consts.yellow]}
                            />
                        }
                        data={results}
                        renderItem={renderItem}
                        keyExtractor={(item) => `${item.id_client}`}
                    />
                </View>
            </View>
            <DialogBox ref={dialogbox} isOverlayClickClose={true} />
            <Footer />
        </>
    )
}