import * as React from 'react'
import { Title } from '../../components/Title/Title';
import { TouchableHighlight, View, TextInput, Text, ScrollView } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import Snackbar from 'react-native-snackbar';
import { btn, dropdown, inputGroup } from '../../assets/styles/Styles';
import { onRunExternalRQST } from '../../services/communications';
import Spinner from 'react-native-loading-spinner-overlay';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import SelectDropdown from 'react-native-select-dropdown';
import { Entypo } from '@expo/vector-icons';
import { addDays, belongsToThisCooperative, checkIfExpired, decodeBase64, formatDate, randomLongNumber, randomString, unixToDate } from '../../assets/helper/helper.all';
import { Loader } from '../../components/Loader/comp.loader';
import DialogBox from 'react-native-dialogbox';
import { routes } from '../../assets/helper/helper.routes';
import { BarcodereaderComponenent } from '../../components/Scanner/ScannerComponent';
import DatePicker from 'react-native-date-picker';
import PosPrinter from 'react-native-pos-printer';
import { RefreshControl } from 'react-native';


export const ApprovionnementScreen = ({ route, navigation }) => {
    const { params } = route
    const { item, products: as_product_list } = params

    const [isloading, setisloading] = React.useState(false)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [lines, setlines] = React.useState([1]);
    const [output, setoutput] = React.useState("");
    const [products, setproducts] = React.useState(as_product_list || [])
    const [unity, setunity] = React.useState("");
    const [items, setitems] = React.useState({});
    const ref = React.useRef();
    const { idcooperative, user, token } = global;
    const { num_enregistrement, sigle, cooperative, adresse, __tbl_ecom_users } = global.coopec || {}
    const { nom, postnom, phone, realid } = user;
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState(new Date())
    const [rescann, setrescann] = React.useState(false)
    const [customer, setcustomer] = React.useState({})
    const [expiredon, id_customer, id_cooperative] = String(item).split(".")

    const itemSchema = Yup.object().shape({
        qte: Yup.number()
            .min(1, 'La quantité doit avoir une valeur superieur à zero (0)')
            .max(50000, 'La quantité doit avoir une valeur inferieur à 50000')
            .required('La quantité doit avoir une valeur superieur à (0) et inferieur à 50000'),
        produit: Yup.number()
            .min(1, 'Veillez selectionner un produit !')
            .required('Veillez selectionner un produit !'),
        prix_unitaire: Yup.string().required('Entre le prix avant de continuer'),
        currency: Yup.string().required('Sélectionner la dévise'),
        date_production: Yup.string().required('Sélectionner la date de production avant de continuer !')
    });

    const handleApprovisionnement = () => {
        const _items = Object.values(items)
        setisloading(true)
        onRunExternalRQST({
            data: {
                id_ccoperative: idcooperative,
                id_cooperative: idcooperative,
                date_production: `${new Date().toString()}`,
                date_expiration: `${addDays({ plusDays: 5 })}`,
                approv_by: realid,
                description: `Approvisonnement par ${nom}-${postnom}-${phone} de ${_items.length} produits en date du ${new Date().toString()}`,
                items: Array.from(_items).map(item => ({ ...item, id_member: id_customer })),
                token
            },
            method: "POST",
            url: `/stocks/stock/in`
        }, (err, done) => {
            setisloading(false)
            if (done) {
                const { data, status, message } = done
                if (status === 200) {
                    const { createdAt, transaction, valorisation, produits } = data
                    const item_ = { ...data, __tbl_ecom_cooperative: global.coopec, "derictly-printed": true, membre: customer }

                    confirmAndPrint({ item: item_ })
                    Snackbar.show({
                        text: "Opération d'approvisionnement réussie avec succès !",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.primaryColor
                    });
                    // navigation.navigate(routes['storage'], { idcooperative })
                } else {
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

    const handleSubmit = ({ values }) => {
        const {
            currency,
            // date_production_d,
            // date_production_m,
            // date_production_y,
            date_production,
            key,
            prix_unitaire,
            produit,
            qte
        } = values;
        items[key] = {
            id_produit: parseInt(produit),
            qte: parseInt(qte),
            id_member: parseInt(customer['id']),
            prix_unitaire: parseFloat(prix_unitaire),
            currency: String(currency).toUpperCase().trim(),
            date_production: date_production
        }
        setitems(items)
        forceUpdate()
    }

    const loadCustomer = async ({ id_customer }) => {
        setisloading(true)
        await onRunExternalRQST({
            method: "GET",
            url: `/users/user/${id_customer}`,
        }, (err, done) => {
            setisloading(false)
            if (done) {
                const { status, message, data } = done;
                if (status === 200) {
                    setcustomer(data)
                    // setshowform(true)
                } else {
                    ref.current.confirm({
                        title: <Text style={{ fontFamily: "mons" }}>Carte non autorisée</Text>,
                        content: [<Text style={{ fontFamily: "mons-e" }}>Cette opération ne peut être effectuer car la carte scannée appartient à une coopérative autre que <Text style={{ fontFamily: "mons" }}>{cooperative}</Text> essayer avec une autre carte</Text>],
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
                            callback: () => navigation.navigate(routes['home'])
                        }
                    })
                    Snackbar.show({
                        text: "Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.dangerColor
                    });
                }
            } else {
                ref.current.confirm({
                    title: <Text style={{ fontFamily: "mons" }}>Carte non autorisée</Text>,
                    content: [<Text style={{ fontFamily: "mons-e" }}>Cette opération ne peut être effectuer car la carte scannée appartient à une coopérative autre que <Text style={{ fontFamily: "mons" }}>{cooperative}</Text> essayer avec une autre carte</Text>],
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
                        callback: () => navigation.navigate(routes['home'])
                    }
                })
                Snackbar.show({
                    text: "Une erreur est survenue lors de traitement des informations ! assurez vous d'être connecté sur internet avant de continuer",
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Colors.dangerColor
                });
            }
        })
    }

    const confirmAndPrint = async ({ item }) => {
        return new Promise((resolve, reject) => {
            try {
                PosPrinter.connectDevice(`IposPrinter-00:AA:11:BB:22:CC`)//ZCSPrint-66:11:22:33:44:55
                    .then((res) => {
                        delete item['__tbl_ecom_cooperative']['__tbl_ecom_users']
                        delete item['__tbl_ecom_cooperative']['__tbl_ecom_territoire']
                        delete item['__tbl_ecom_cooperative']['__tbl_ecom_province']

                        let current_item = JSON.stringify(item)
                        PosPrinter.printTestReceipt(current_item)
                            .then((res) => resolve("Printer MACADDRESSE: `IposPrinter-00:AA:11:BB:22:CC`"))
                            .catch((err) => reject(err));
                    })
                    .catch((err) => {
                        console.log('====================================');
                        console.log(err);
                        console.log('====================================');
                        return reject(err)
                    });
            } catch (e) {
                console.log(e);
                return reject(e)
            }
        })
    };

    const handleConfirme = () => {
        setlines(lines + 1)
        forceUpdate()
    }

    React.useEffect(() => {
        loadCustomer({ id_customer: id_customer })
        PosPrinter.init(false)
            .then((res) => { })
            .catch((err) => console.log(err));
    }, []);

    return (
        <>
            <Title navigation={navigation} action={() => navigation.replace('tabs')} title={"Nouvel approvisionnement"} subtitle={"Nouvelle ligne d'approvissionnement"} />
            <ScrollView
                contentContainerStyle={{ paddingBottom: 0, backgroundColor: Colors.whiteColor }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode='interactive'
                keyboardShouldPersistTaps="handled"
                refreshControl={<RefreshControl
                    refreshing={isloading}
                    onRefresh={() => loadCustomer({ id_customer: 9 })}
                    colors={[Colors.primaryColor]}
                />}
            >
                <>
                    {!isloading && (
                        <>
                            {Object.keys(customer).length > 0 && (
                                <View style={{ width: "85%", alignContent: "center", alignItems: "center", justifyContent: "center", alignSelf: "center", height: "auto", paddingVertical: 10, backgroundColor: Colors.primaryColor, marginTop: 25 }}>
                                    <Text style={{ fontFamily: "mons", color: Colors.whiteColor }}>
                                        <Text style={{ fontFamily: "mons-e" }}>Numéro de la carte : </Text>
                                        {customer && customer['__tbl_ecom_hasmember'] ? customer['__tbl_ecom_hasmember']['id'] : ""}
                                    </Text>
                                    <Text style={{ fontFamily: "mons", color: Colors.whiteColor }}>
                                        <Text style={{ fontFamily: "mons-e" }}>Membre : </Text>
                                        {customer && customer['nom'] ? String(customer['nom']).concat(" ").concat(customer['postnom']) : ""}
                                    </Text>
                                    <Text style={{ fontFamily: "mons", color: Colors.whiteColor }}>
                                        <Text style={{ fontFamily: "mons-e" }}>Contact Membre : </Text>
                                        {customer && customer['phone'] ? String(customer['phone']) : ""}
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                    {[...lines].map((line, index) => {
                        return (
                            <Formik
                                innerRef={_ => index}
                                key={index * Math.random() * (new Date().getTime())}
                                initialValues={{
                                    key: index,
                                    qte: '',
                                    produit: '',
                                    prix_unitaire: '',
                                    currency: '',
                                    date_production: ''
                                    // date_production_d: '',
                                    // date_production_m: '',
                                    // date_production_y: '',
                                }}
                                validationSchema={itemSchema}
                                onSubmit={values => handleSubmit({ values })}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
                                    return (
                                        <>
                                            {/* -------------------------- */}
                                            <View style={{ borderRadius: 5, width: "96%", alignSelf: "center", backgroundColor: Colors.whiteColor, height: "auto", marginTop: 15, }}>
                                                <View style={{ width: "85%", alignSelf: "center", height: 65, flexDirection: "column", marginTop: 15 }}>
                                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Produit <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                                    <View style={inputGroup.container}>
                                                        <View style={[inputGroup.inputcontainer, { width: "100%" }]}>
                                                            <SelectDropdown
                                                                search
                                                                // searchInputStyle={{ fon }}
                                                                data={products}
                                                                onSelect={(selectedItem, index) => {
                                                                    // console.log(selectedItem, index);
                                                                    const { __tbl_ecom_souscategory, __tbl_ecom_category, __tbl_ecom_unitesmesure, id } = selectedItem
                                                                    const { unity: asunity } = __tbl_ecom_unitesmesure
                                                                    setunity(asunity)
                                                                    handleChange('produit')(`${id}`)
                                                                    // alert(id)
                                                                }}
                                                                renderButton={(selectedItem, isOpened) => {
                                                                    return (
                                                                        <View style={[dropdown.dropdownButtonStyle, { width: "100%", backgroundColor: Colors.whiteColor }]}>
                                                                            <Text style={[dropdown.dropdownButtonTxtStyle, { fontFamily: "mons-b", color: Colors.primaryColor }]}>
                                                                                {(selectedItem && selectedItem.produit) || 'Sélectionner un produit'}
                                                                            </Text>
                                                                            <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="black" />
                                                                        </View>
                                                                    );
                                                                }}
                                                                renderItem={(item, index, isSelected) => {
                                                                    return (
                                                                        <View style={{ ...dropdown.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                                                            <Text style={[dropdown.dropdownItemTxtStyle, { fontFamily: "mons-e", fontSize: Dims.iputtextsize }]}>{item.produit}</Text>
                                                                        </View>
                                                                    );
                                                                }}
                                                                showsVerticalScrollIndicator={false}
                                                                dropdownStyle={dropdown.dropdownMenuStyle}
                                                            />
                                                        </View>
                                                    </View>
                                                    {errors.produit && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor }}>{errors.produit}</Text>}
                                                </View>
                                                <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                                    <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                        <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Quantité <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                                        <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                                            <View style={{ width: "20%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                                                <Text style={{ alignSelf: "center", fontFamily: "mons-b", color: Colors.primaryColor }}>{unity}</Text>
                                                            </View>
                                                            <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                                <TextInput placeholder='1' maxLength={50} keyboardType={"numeric"} onChangeText={(t) => handleChange('qte')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                {errors.qte && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.qte}</Text>}

                                                <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                                    <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                        <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Prix de vente unitaire / 1 {unity} <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                                        <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                                            <View style={{ width: "40%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                                                <SelectDropdown
                                                                    // search
                                                                    data={[{ id: "CDF" }, { id: "USD" }]}
                                                                    onSelect={(selectedItem, index) => {
                                                                        const { id } = selectedItem
                                                                        handleChange('currency')(`${id}`)
                                                                    }}
                                                                    renderButton={(selectedItem, isOpened) => {
                                                                        return (
                                                                            <View style={[dropdown.dropdownButtonStyle, { width: "100%", backgroundColor: Colors.whiteColor }]}>
                                                                                <Text style={[dropdown.dropdownButtonTxtStyle, { fontFamily: "mons-b", color: Colors.primaryColor }]}>
                                                                                    {(selectedItem && selectedItem.id) || 'Dévise'}
                                                                                </Text>
                                                                                <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="black" />
                                                                            </View>
                                                                        );
                                                                    }}
                                                                    renderItem={(item, index, isSelected) => {
                                                                        return (
                                                                            <View style={{ ...dropdown.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                                                                <Text style={[dropdown.dropdownItemTxtStyle, { fontFamily: "mons-e", fontSize: Dims.iputtextsize }]}>{item.id}</Text>
                                                                            </View>
                                                                        );
                                                                    }}
                                                                    showsVerticalScrollIndicator={false}
                                                                    dropdownStyle={dropdown.dropdownMenuStyle}
                                                                />
                                                            </View>
                                                            <View style={{ width: "60%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                                <TextInput placeholder='1000' maxLength={50} keyboardType={"numeric"} onChangeText={(t) => handleChange('prix_unitaire')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                {(errors.prix_unitaire || errors.currency) && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.prix_unitaire || errors.currency}</Text>}
                                                <DatePicker
                                                    key={randomString({ length: 12 })}
                                                    title={null}
                                                    modal
                                                    mode='date'
                                                    open={open}
                                                    date={date}
                                                    cancelText='Annuler'
                                                    confirmText='Confirmer'
                                                    onConfirm={(date) => {
                                                        setOpen(false)
                                                        // setDate(date)
                                                        handleChange('date_production')(`${formatDate({ date })}`)
                                                    }}
                                                    onCancel={() => {
                                                        setOpen(false)
                                                    }}
                                                />
                                                {/* ====================================================================== */}
                                                <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius, marginBottom: 20 }}>
                                                    <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                        <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Date de production du produit <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                                        <TouchableHighlight underlayColor={Colors.whiteColor} style={[inputGroup.container, { flexDirection: "row-reverse", width: "100%" }]} onPress={() => { setOpen(!open) }} >
                                                            <View style={{ width: "100%", justifyContent: "flex-start", paddingLeft: 20, alignContent: "flex-start", alignItems: "center", flexDirection: "row" }}>
                                                                <Text style={{ fontFamily: "mons-e", color: Colors.primaryColor }}>{values.date_production || "Selectionner une date de production"}</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                    </View>
                                                </View>
                                                {errors.date_production && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 5 }}>{errors.date_production}</Text>}
                                            </View>
                                            <View style={{ width: "85%", height: 65, flexDirection: "column", marginVertical: 25, alignItems: "center", alignSelf: "center", marginTop: 50 }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <TouchableHighlight
                                                        onPress={handleSubmit}
                                                        disabled={isloading}
                                                        underlayColor={Colors.primaryColor}
                                                        style={[btn, { width: "35%" }]}
                                                    >
                                                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Confirmer</Text>
                                                    </TouchableHighlight>
                                                    <View style={{ width: "5%" }} />
                                                    <TouchableHighlight
                                                        onPress={() => {
                                                            handleConfirme()
                                                        }}
                                                        disabled={isloading}
                                                        underlayColor={Colors.primaryColor}
                                                        style={[btn, { width: "60%" }]}
                                                    >
                                                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Ajouter une nouvelle ligne</Text>
                                                    </TouchableHighlight>
                                                </View>
                                                <Text style={{ fontFamily: "mons", fontSize: Dims.subtitletextsize, marginVertical: 10, color: Colors.dangerColor, textAlign: "center" }}>
                                                    {output}
                                                </Text>
                                            </View>
                                        </>
                                    )
                                }}
                            </Formik>
                        )
                    })}
                </>
                <>
                    <View style={{ width: "85%", height: 65, flexDirection: "column", marginVertical: 25, alignItems: "center", alignSelf: "center", marginTop: 50 }}>
                        <TouchableHighlight
                            onPress={() => {
                                ref.current.confirm({
                                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Approvisionnement</Text>,
                                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Vous êtes sur le point de faire un approvisionnement dans le stock cooperative, voulez-vous vraiement continuer ?</Text>],
                                    ok: {
                                        text: 'Confirmer',
                                        style: {
                                            color: Colors.primaryColor,
                                            fontFamily: 'mons'
                                        },
                                        callback: () => handleApprovisionnement()

                                    },
                                    cancel: {
                                        text: 'Annuler',
                                        style: {
                                            color: Colors.darkColor,
                                            fontFamily: "mons-e"
                                        }
                                    },
                                })
                            }}
                            disabled={isloading || Object.keys(items).length <= 0}
                            underlayColor={Colors.primaryColor}
                            style={[btn, { backgroundColor: Object.keys(items).length > 0 ? Colors.primaryColor : Colors.pillColor }]}
                        >
                            {isloading
                                ?
                                <Loader />
                                :
                                <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Enregitrer tout</Text>
                            }
                        </TouchableHighlight>
                        <Text style={{ fontFamily: "mons", fontSize: Dims.subtitletextsize, marginVertical: 10, color: Colors.dangerColor, textAlign: "center" }}>
                            {output}
                        </Text>
                    </View>
                </>
            </ScrollView>
            <DialogBox ref={ref} isOverlayClickClose={true} />
        </>
    )
}