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
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { addDays, belongsToThisCooperative, checkIfExpired, decodeBase64, formatDate, randomLongNumber, randomString, unixToDate } from '../../assets/helper/helper.all';
import { Divider } from 'react-native-elements';
import { Loader } from '../Loader/comp.loader';

export const EditPriceOnMarketPlace = ({ current, coopec }) => {

    const [output, setOutput] = React.useState("")
    const [isloading, setisloading] = React.useState(false)
    const itemSchema = Yup.object().shape({
        prix_unitaire: Yup.string().required('Entre le prix avant de continuer'),
        currency: Yup.string().required('Sélectionner la dévise'),
    });
    const { id_product_on_market, currency: as_old_currecy, prix_plus_commission: as_old_price, produit, qte, unity, qte_critique } = current || {}
    const { id: id_ccoperative } = coopec
    const [currency, setCurrency] = React.useState(as_old_currecy)
    const [prix_plus_commission, setPrix_plus_commission] = React.useState(as_old_price)

    const onSubmit = async ({ values }) => {
        const { prix_unitaire, currency: inner_currecny } = values;
        setisloading(true)
        onRunExternalRQST({
            method: "POST",
            data: {
                id_produit_on_marketplce: id_product_on_market,
                price: prix_unitaire,
                currency:inner_currecny,
                id_cooperative: id_ccoperative
            },
            url: `/stocks/stock/editproductprice`
        }, (err, done) => {
            setisloading(false);
            if (done) {
                const { status, message, data } = done;
                if (status === 200) {
                    setCurrency(inner_currecny)
                    setPrix_plus_commission(prix_unitaire)
                    Snackbar.show({
                        text: "Le prix du produit sur le marché a été mis à jour avec succès ",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.primaryColor
                    });
                } else {
                    Snackbar.show({
                        text: "Une erreur vient de se produire !",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.dangerColor
                    });
                }
            } else {
                Snackbar.show({
                    text: "Une erreur vient de se produire !",
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Colors.dangerColor
                });
            }
        });
    }

    React.useEffect(() => { }, [])

    return (
        <>
            <Formik
                innerRef={_ => randomLongNumber({ length: 4 })}
                key={Date.now() * Math.random() * (new Date().getTime())}
                initialValues={{
                    prix_unitaire: prix_plus_commission,
                    currency: currency,
                }}
                validationSchema={itemSchema}
                onSubmit={values => onSubmit({ values })}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
                    return (
                        <>
                            {/* -------------------------- */}
                            <View style={{ borderRadius: 5, width: "96%", alignSelf: "center", backgroundColor: Colors.whiteColor, height: "auto", marginTop: 15, }}>
                                <View
                                    style={{ width: "85%", alignSelf: "center", padding: 8, paddingLeft: 12, backgroundColor: Colors.whiteColor, borderRadius: 10, paddingTop: 20 }}
                                >
                                    <Text style={{ fontFamily: "mons-e", }}>
                                        Produit: <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{produit}</Text>
                                    </Text>
                                    <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "flex-start", alignItems: "center" }}>
                                        <Text style={{ fontFamily: "mons-e", }}>Quantité dispo.:</Text>
                                        {(qte > qte_critique)
                                            ? <MaterialIcons name="arrow-drop-up" size={24} color={Colors.successColor} />
                                            : <MaterialIcons name="arrow-drop-down" size={24} color={Colors.dangerColor} />
                                        }
                                        <Text style={{ fontFamily: "mons-b" }}>{qte}</Text>
                                    </View>
                                    <Text style={{ fontFamily: "mons-e", }}>Unité de més.: <Text style={{ fontFamily: "mons-b" }}>{unity}</Text></Text>
                                    {/* <Text style={{ fontFamily: "mons-e",  }}>Mis à jour: <Text style={{ fontFamily: "mons-b" }}>{d}</Text></Text> */}
                                    <Divider style={{ marginVertical: 5 }} />
                                    <View>
                                        <Text style={{ fontFamily: "mons-e", }}>Prix unitaire</Text>
                                        <Text style={{ fontFamily: "mons-b", color: Colors.dangerColor, }}>{prix_plus_commission} {currency} / {unity}</Text>
                                    </View>
                                </View>
                                <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                    <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                        <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Prix de vente unitaire / 1 {unity} <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                        <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                            <View style={{ width: "40%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                                <SelectDropdown
                                                    // search
                                                    data={[{ id: "CDF" }, { id: "USD" }]}
                                                    // defaultValue={`${values.currency}`}
                                                    defaultValueByIndex={`${values.currency}`}
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
                                                <TextInput value={`${values.prix_unitaire}`} placeholder='1000' maxLength={50} keyboardType={"numeric"} onChangeText={(t) => handleChange('prix_unitaire')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {(errors.prix_unitaire || errors.currency) && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.prix_unitaire || errors.currency}</Text>}
                            </View>
                            <View style={{ width: "85%", height: 65, flexDirection: "column", marginVertical: 25, alignItems: "center", alignSelf: "center", marginTop: 50 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableHighlight
                                        onPress={handleSubmit}
                                        disabled={isloading}
                                        underlayColor={Colors.primaryColor}
                                        style={[btn, { width: "100%" }]}
                                    >
                                        {isloading ? <Loader /> : <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Confirmer</Text>}
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
        </>
    )
}