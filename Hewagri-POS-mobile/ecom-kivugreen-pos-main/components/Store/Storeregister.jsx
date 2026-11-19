import * as React from 'react';
import { Text, View, ActivityIndicator, ScrollView, TouchableHighlight, Modal, RefreshControl } from 'react-native';
import { onRunExternalRQST } from '../../services/communications';
import Snackbar from 'react-native-snackbar';
import { Colors } from '../../assets/colors/Colors';
import { EmptyList } from '../Emptylist/com.emptylist';
import { formatDate, randomLongNumber, randomString } from '../../assets/helper/helper.all';
import { Loader } from '../Loader/comp.loader';
import { MaterialIcons } from '@expo/vector-icons';
import DialogBox from 'react-native-dialogbox';
import { btn } from '../../assets/styles/Styles';
import { Divider } from 'react-native-elements';
import { EditPriceOnMarketPlace } from './Storeeditprice';
import { Title } from '../Title/Title';

export const StoreAsRegisterComponent = ({ isloading, zork = false }) => {
    const [store, setStore] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const { num_enregistrement, phone, sigle, cooperative, adresse, __tbl_ecom_users, id: idcooperative } = global.coopec || {}
    const ref = React.useRef();
    const [current, setCurrent] = React.useState({})

    const onLoad = async () => {
        setIsLoading(true);
        onRunExternalRQST({
            method: "GET",
            url: `/stocks/register/${idcooperative}`
        }, (err, done) => {
            setIsLoading(false);
            if (done) {
                const { status, message, data } = done;
                if (status === 200) {
                    const { rows } = data;
                    setStore(rows);
                } else {
                    setStore([])
                    Snackbar.show({
                        text: "Une erreur vient de se produire !",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.dangerColor
                    });
                }
            } else {
                setStore([])
                Snackbar.show({
                    text: "Une erreur vient de se produire !",
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Colors.dangerColor
                });
            }
        });
    };

    React.useEffect(() => {
        onLoad();
    }, [isloading]);

    // Split data into pairs for two columns layout
    const pairedStore = store.reduce((result, value, index, array) => {
        if (index % 2 === 0) result.push(array.slice(index, index + 2));
        return result;
    }, []);

    return (
        <View style={{ flex: 1, width: "100%", paddingHorizontal: 8 }}>
            <View style={{ width: "100%", marginBottom: 10, marginTop: 20 }}>
                <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor, alignSelf: "center" }}>Etat de stock | coopérative {cooperative}</Text>
                <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor, alignSelf: "center" }}>Produits ( {store.length} )</Text>
            </View>
            {isLoading ? (
                <View style={{ marginVertical: 20, marginBottom: 40 }}>
                    <Loader size={30} color={Colors.primaryColor} />
                </View>
            ) : store.length === 0 ? (
                <EmptyList options={{ color: Colors.whiteColor }} />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        minHeight: "130%"
                    }}
                    refreshControl={<RefreshControl
                        refreshing={isLoading}
                        onRefresh={onLoad}
                        colors={[Colors.primaryColor]}
                    />}
                >
                    {pairedStore.map((pair, rowIndex) => (
                        <View style={{ flexDirection: "row", marginBottom: 10, justifyContent: "space-between" }} key={rowIndex}>
                            {pair.map(item => {
                                const { lastUpdated, produit, qte, unity, qte_critique, prix_plus_commission, currency, id_product_on_market } = item;
                                const [d, h] = String(formatDate({ date: lastUpdated })).split(",") || ["", ""]
                                return (
                                    <TouchableHighlight
                                        key={randomLongNumber({ length: 5 })}
                                        onPress={() => {
                                            if (zork) {
                                                ref.current.confirm({
                                                    title: <Text style={{ fontFamily: "mons" }}>Etat de ( {produit} )</Text>,
                                                    content: [
                                                        <View style={{ width: 300, padding: 8, paddingLeft: 12, }}>
                                                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>
                                                                Produit: <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{produit}</Text>
                                                            </Text>
                                                            <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "flex-start", alignItems: "center" }}>
                                                                <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Quantité disponible:</Text>
                                                                {(qte > qte_critique)
                                                                    ? <MaterialIcons name="arrow-drop-up" size={24} color={Colors.successColor} />
                                                                    : <MaterialIcons name="arrow-drop-down" size={24} color={Colors.dangerColor} />
                                                                }
                                                                <Text style={{ fontFamily: "mons-b" }}>{qte} {unity}</Text>
                                                            </View>
                                                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Unité de mésure: <Text style={{ fontFamily: "mons-b" }}>{unity}</Text></Text>
                                                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Prix unitaire: <Text style={{ fontFamily: "mons-b" }}>{prix_plus_commission} {currency}</Text></Text>
                                                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Dernière mis à jour: <Text style={{ fontFamily: "mons-b" }}>{d}</Text></Text>
                                                            <View>
                                                                <Divider style={{ marginVertical: 5 }} />
                                                                <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Prix unitaire</Text>
                                                                <Text style={{ fontFamily: "mons-b", color: Colors.dangerColor, fontSize: 12 }}>{prix_plus_commission} {currency} / {unity}</Text>
                                                            </View>
                                                        </View>
                                                    ],
                                                    ok: {
                                                        text: "Modifier le prix sur le marché",
                                                        style: {
                                                            fontFamily: "mons",
                                                            color: Colors.primaryColor,
                                                        },
                                                        callback: () => {
                                                            setCurrent(item)
                                                            // setrescann(true)
                                                        }
                                                    },
                                                    cancel: {
                                                        text: "Annuler",
                                                        style: {
                                                            fontFamily: "mons-e",
                                                            color: Colors.primaryColor
                                                        },
                                                        callback: () => ({})
                                                    }
                                                })
                                            }
                                        }}
                                        underlayColor={"transparent"}
                                        style={{ width: "48.5%", padding: 8, paddingLeft: 12, backgroundColor: Colors.pillColor, borderRadius: 10, borderLeftColor: Colors.primaryColor, borderLeftWidth: 2, elevation: zork ? 2 : 0 }}
                                    >
                                        <View>
                                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>
                                                Produit: <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{produit}</Text>
                                            </Text>
                                            <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "flex-start", alignItems: "center" }}>
                                                <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Quantité dispo.:</Text>
                                                {(qte > qte_critique)
                                                    ? <MaterialIcons name="arrow-drop-up" size={24} color={Colors.successColor} />
                                                    : <MaterialIcons name="arrow-drop-down" size={24} color={Colors.dangerColor} />
                                                }
                                                <Text style={{ fontFamily: "mons-b" }}>{qte}</Text>
                                            </View>
                                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Unité de més.: <Text style={{ fontFamily: "mons-b" }}>{unity}</Text></Text>
                                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Mis à jour: <Text style={{ fontFamily: "mons-b" }}>{d}</Text></Text>
                                            <Divider style={{ marginVertical: 5 }} />
                                            <View>
                                                <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Prix unitaire</Text>
                                                <Text style={{ fontFamily: "mons-b", color: Colors.dangerColor, fontSize: 12 }}>{prix_plus_commission} {currency} / {unity}</Text>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                );
                            })}
                        </View>
                    ))}
                </ScrollView>
            )
            }
            <View style={{ width: "100%", alignContent: "center", alignItems: "center", alignSelf: "center", position: "absolute", bottom: 7, backgroundColor: Colors.whiteColor, padding: 10 }}>
                <TouchableHighlight
                    style={[btn, { flexDirection: "row", alignContent: "center", alignItems: "center", alignSelf: "center", backgroundColor: Colors.primaryColor }]}
                    underlayColor={Colors.primaryColor}
                    onPress={() => {
                        onLoad()
                    }}
                    disabled={isLoading}
                >
                    <>
                        <MaterialIcons name='refresh' size={15} color={Colors.whiteColor} />
                        <Text style={{ fontFamily: "mons-b", color: Colors.whiteColor, marginLeft: 10 }}>Actualiser l'état de stock</Text>
                    </>
                </TouchableHighlight>
            </View>
            <DialogBox ref={ref} isOverlayClickClose={false} />
            <Modal
                visible={Object.keys(current).length > 0}
            >
                <Title
                    navigation={() => { }}
                    action={() => {
                        setCurrent({})
                    }}
                    title={"Modifier le prix sur le marché"}
                    subtitle={"Modification du prix du produit sur le marché"}
                />
                <EditPriceOnMarketPlace
                    coopec={global.coopec}
                    current={current}
                    key={8292939}
                />
            </Modal>
        </View>
    );
};
