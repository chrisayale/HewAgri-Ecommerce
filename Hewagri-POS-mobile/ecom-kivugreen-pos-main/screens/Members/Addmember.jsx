import * as React from 'react'
import { Title } from '../../components/Title/Title'
import { RefreshControl, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Colors } from '../../assets/colors/Colors';
import DialogBox from 'react-native-dialogbox';
import Snackbar from 'react-native-snackbar';
import SelectDropdown from 'react-native-select-dropdown'
import { btn, dropdown, inputGroup } from '../../assets/styles/Styles';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Entypo, Ionicons } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { EmptyList } from '../../components/Emptylist/com.emptylist';
import { FlatList } from 'react-native';
import { onRunExternalRQST } from '../../services/communications';
import { formatDate, genders, unixToDate } from '../../assets/helper/helper.all';
import { Divider } from 'react-native-elements';
import { handleSearch } from 'dm-handlesearch';
import { ScrollView } from 'react-native';
import { Loader } from '../../components/Loader/comp.loader';

export const AddmemberScreen = ({ route, navigation }) => {

    const { idcooperative, user, token } = global;
    const [isloading, setisloading] = React.useState();
    const [output, setoutput] = React.useState("");
    const [step, setstep] = React.useState(0);
    const [list, setlist] = React.useState([])
    const [temps, settemps] = React.useState([]);
    const [keyword, setkeyword] = React.useState("");
    const [villages, setvillages] = React.useState([])

    const memberSchemas = Yup.object().shape({
        nom: Yup.string().required('Entre le nom ici'),
        postnom: Yup.string().required('Entre le postnom ici'),
        // prenom: Yup.string().required('Entre le prenom ici'),
        phone: Yup.string().required('Entre le numéro de téléphone').matches(
            /^(?:\+243|0)(81|82|83|84|85|89|97|99|98)\d{7}$/,
            'Le numéro doit commencer par +243 ou 0 et être suivi d’un préfixe valide (81, 82, 83, etc.).'
        ),
        genre: Yup.string().required('Selectionner le sexe'),
        hectare_cultive: Yup.number().required("Entre l'hectare cultivé par l'agriculteur"),
        // currency: Yup.string().required('Sélectionner la dévise'),
        date_production_d: Yup.number().positive().min(1).max(31).required('Entrer le jour de naissance'),
        date_production_m: Yup.number().positive().min(1).max(12).required('Entrer le mois de naissance'),
        date_production_y: Yup.number().positive().min(new Date().getFullYear() - 100).max(new Date().getFullYear() - 17).required(`Entrer une valeur pour l\'année qui est valide inferieure à ${new Date().getFullYear() - 17}`),
    });

    const __handleSubmit = async (values, { resetForm }) => {
        const { password, nom, postnom, date_production_d, date_production_m, date_production_y } = values;
        const data = {
            ...values,
            idroles: [4, 5],
            password,//String(password).concat(String(nom).substring(0, 1).toUpperCase()).concat(String(postnom).substring(0, 1).toLocaleLowerCase()),
            date_naiss: String(date_production_d).padStart(2, '0').concat('/').concat(String(date_production_m).padStart(2, '0')).concat('/').concat(String(date_production_y))
        }
        setisloading(true)
        onRunExternalRQST({
            url: '/users/user/register',
            data,
            method: "POST",
        }, (err, done) => {
            console.log('====================================');
            console.log(done, err);
            console.log('====================================');
            setisloading(false);
            if (done) {
                const { status, data, message } = done;
                if (status === 200) {
                    Snackbar.show({
                        text: "Enregitrement effectué avec succès !",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.successColor
                    });
                    resetForm()
                } else {
                    Snackbar.show({
                        text: "Erreur d'enregistrement vient de se produire !, réessayer un peu plus tard; en entrant des informations valides ",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.dangerColor
                    });
                }
            } else {
                Snackbar.show({
                    text: "Erreur d'enregistrement vient de se produire !, réessayer un peu plus tard",
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Colors.dangerColor
                });
            }
        })
    }

    const __onSearch = async ({ k }) => {
        setisloading(true);
        handleSearch({
            rows: temps,
            columns: ['id'],
            keyword: k,
            cb: ({ rows, length }) => {
                setisloading(false)
                setlist(rows)
            }
        })
    }

    const renderItem = ({ item }) => {
        const { carte, createdAt, date_expiration, date_expiration_unix, id: asid, updatedAt, __tbl_ecom_user, __tbl_ecom_cooperative } = item;
        const { email, id, nom, postnom, phone, prenom } = __tbl_ecom_user;
        const { sigle, cooperative } = __tbl_ecom_cooperative;

        return (
            <View style={{ width: "100%", padding: 10, backgroundColor: Colors.pillColor, elevation: 5, marginTop: 15, flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: "100%" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={{ fontFamily: "mons-e", fontSize: 18 }}>ID: <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{asid}</Text></Text>
                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Coopec: <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{cooperative}</Text></Text>
                        </View>
                        <View>
                            <Text style={{ fontFamily: "mons-e", fontSize: 14 }}>Membre depuis</Text>
                            <Text style={{ fontFamily: "mons-b", fontSize: 14 }}>{formatDate({ date: createdAt })}</Text>
                        </View>
                    </View>
                    <Divider />
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ marginTop: 10, width: "40%" }}>
                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Nom: <Text style={{ fontFamily: "mons-b" }}>{nom}</Text></Text>
                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Postnom: <Text style={{ fontFamily: "mons-b" }}>{postnom}</Text></Text>
                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Prenom: <Text style={{ fontFamily: "mons-b" }}>{prenom}</Text></Text>
                        </View>
                        <View style={{ marginTop: 10, width: "60%" }}>
                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Télé.: <Text style={{ fontFamily: "mons-b" }}>{phone}</Text></Text>
                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Email: <Text style={{ fontFamily: "mons-b" }}>{email}</Text></Text>
                            <Text style={{ fontFamily: "mons-e", fontSize: 12 }}>Exp.: <Text style={{ fontFamily: "mons-b", color: Colors.dangerColor }}>{unixToDate({ unix: date_expiration_unix })}</Text></Text>
                        </View>
                    </View>
                </View>
                <View style={{ width: "10%", alignContent: "center", alignItems: "center", backgroundColor: Colors.pillColor }}>
                    <Entypo name="chevron-right" size={24} color={Colors.primaryColor} />
                </View>
            </View>
        )
    }

    const __onLoad = async () => {
        setisloading(true)
        onRunExternalRQST({
            method: "GET",
            url: `/members/list/byothercooperatives/${idcooperative}` //`
        }, (err, done) => {
            setisloading(false)
            if (done) {
                const { status, message, data } = done;
                if (status === 200) {
                    const { rows } = data;
                    setlist(rows || [])
                    settemps(rows || [])
                } else {
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

    const __onLoadVillages = async () => {
        setisloading(true)
        onRunExternalRQST({
            method: "GET",
            url: `/villages/list` //${idcooperative}`
        }, (err, done) => {
            setisloading(false)
            if (done) {
                const { status, message, data } = done;
                if (status === 200) {
                    const { rows } = data;
                    setvillages(rows)
                } else {
                    setvillages([])
                    Snackbar.show({
                        text: "Erreur de chargement veuillez réessayez encore",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.dangerColor
                    });
                }
            } else {
                setvillages([])
                Snackbar.show({
                    text: "Erreur de chargement veuillez réessayez encore",
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: Colors.dangerColor
                });
            }
        })
    }

    const tabs = [
        {
            name: 'Nouveau membre',
            key: 0,
            content: (
                <>
                    <EmptyList />
                </>
            )
        },
        {
            name: 'Ancien utilisateur',
            key: 1,
            content: (
                <>
                    <EmptyList />
                </>
            )
        }
    ];

    React.useEffect(() => {
        __onLoadVillages()
        __onLoad()
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <Title navigation={navigation} title={"Ajout membre"} subtitle={"Formulaire d'ajout d'un membre"} />
            <View style={{ width: "85%", alignSelf: "center", position: "absolute", top: 100, flex: 1, zIndex: 100 }}>
                <SegmentedControl
                    tintColor={Colors.whiteColor}
                    style={{
                        height: 60,
                        // borderRadius:  || Dims.borderradius,
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
                        // backgroundColor: "lime"
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
                        // __handleScreeChanged({ key: nativeEvent })
                    }}
                    activeStyle={{ borderRadius: 40 }}
                />
            </View>
            <View style={{ width: "100%", paddingTop: 60 }}>
                {step === 0 && (
                    <Formik
                        key={788775}
                        initialValues={{
                            // key: index,
                            nom: '',
                            postnom: '',
                            prenom: '',
                            phone: '',
                            genre: '',
                            email: undefined,
                            hectare_cultive: 1,
                            id_cooperative: idcooperative,
                            date_production_d: '',
                            date_production_m: '',
                            date_production_y: '',
                            password: '123456',
                            idprovince: undefined,
                            idterritoire: undefined,
                            idvillage: undefined
                        }}
                        validationSchema={memberSchemas}
                        onSubmit={__handleSubmit}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
                            return (
                                <>
                                    {/* -------------------------- */}
                                    <ScrollView
                                        contentContainerStyle={{ paddingBottom: "30%" }}
                                        showsVerticalScrollIndicator={false}
                                        refreshControl={<RefreshControl
                                            colors={[Colors.primaryColor]}
                                            refreshing={isloading}
                                            onRefresh={() => { }}
                                        />}
                                    >
                                        <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor, height: "auto", marginTop: 15, paddingTop: 0 }}>
                                            <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                                <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Nom <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                                    <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                                        <View style={{ width: "20%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                                            {/* <Text style={{ alignSelf: "center", fontFamily: "mons-b", color: Colors.primaryColor }}>{unity}</Text> */}
                                                        </View>
                                                        <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                            <TextInput value={values.nom} placeholder='nom' maxLength={50} keyboardType={"default"} onChangeText={(t) => handleChange('nom')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            {errors.nom && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.nom}</Text>}

                                            <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                                <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Postnom <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                                    <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                                        <View style={{ width: "20%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                                            {/* <Text style={{ alignSelf: "center", fontFamily: "mons-b", color: Colors.primaryColor }}>{unity}</Text> */}
                                                        </View>
                                                        <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                            <TextInput value={values.postnom} placeholder='Postnom' maxLength={50} keyboardType={"default"} onChangeText={(t) => handleChange('postnom')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            {errors.postnom && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.postnom}</Text>}

                                            <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                                <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                    {/* <Text style={{ color: Colors.dangerColor }}>*</Text> */}
                                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Prenom </Text>
                                                    <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                                        <View style={{ width: "20%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                                            {/* <Text style={{ alignSelf: "center", fontFamily: "mons-b", color: Colors.primaryColor }}>{unity}</Text> */}
                                                        </View>
                                                        <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                            <TextInput value={values.prenom} placeholder='Prenom' maxLength={50} keyboardType={"default"} onChangeText={(t) => handleChange('prenom')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            {errors.prenom && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.prenom}</Text>}

                                            <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                                <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Phone <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                                    <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                                        <View style={{ width: "20%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                                            {/* <Text style={{ alignSelf: "center", fontFamily: "mons-b", color: Colors.primaryColor }}>{unity}</Text> */}
                                                        </View>
                                                        <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                            <TextInput value={values.phone} placeholder='Numéro de téléphone' maxLength={50} keyboardType={"number-pad"} onChangeText={(t) => handleChange('phone')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            {errors.phone && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.phone}</Text>}

                                            <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                                <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Adresse email</Text>
                                                    <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                                        <View style={{ width: "20%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                                            {/* <Text style={{ alignSelf: "center", fontFamily: "mons-b", color: Colors.primaryColor }}>{unity}</Text> */}
                                                        </View>
                                                        <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                            <TextInput value={values.email} placeholder='Adresse email' maxLength={50} keyboardType={"email-address"} onChangeText={(t) => handleChange('email')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            {errors.email && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.email}</Text>}

                                            <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                                <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Hectare cultivé</Text>
                                                    <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                                        <View style={{ width: "20%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                                            {/* <Text style={{ alignSelf: "center", fontFamily: "mons-b", color: Colors.primaryColor }}>{unity}</Text> */}
                                                        </View>
                                                        <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                            <TextInput value={values.hectare_cultive} placeholder='Hectare cultivé' maxLength={50} keyboardType={"numeric"} onChangeText={(t) => handleChange('hectare_cultive')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            {errors.hectar_cultive && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.hectar_cultive}</Text>}

                                            <View style={{ width: "85%", alignSelf: "center", height: 65, flexDirection: "column", marginTop: Dims.bigradius, marginBottom: 20 }}>
                                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Sexe <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                                <View style={inputGroup.container}>
                                                    <View style={[inputGroup.inputcontainer, { width: "100%" }]}>
                                                        <SelectDropdown
                                                            // search
                                                            // searchInputStyle={{ fon }}
                                                            data={[...genders]}
                                                            onSelect={(selectedItem, index) => {
                                                                // console.log(selectedItem, index);
                                                                const { id } = selectedItem
                                                                // setunity(asunity)
                                                                handleChange('genre')(`${id}`)
                                                                // alert(id)
                                                            }}
                                                            renderButton={(selectedItem, isOpened) => {
                                                                return (
                                                                    <View style={[dropdown.dropdownButtonStyle, { width: "100%", backgroundColor: Colors.whiteColor }]}>
                                                                        <Text style={[dropdown.dropdownButtonTxtStyle, { fontFamily: "mons-b", color: Colors.primaryColor }]}>
                                                                            {(selectedItem && selectedItem.label) || 'Sélectionner le sexe'}
                                                                        </Text>
                                                                        <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="black" />
                                                                    </View>
                                                                );
                                                            }}
                                                            renderItem={(item, index, isSelected) => {
                                                                return (
                                                                    <View style={{ ...dropdown.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                                                        <Text style={[dropdown.dropdownItemTxtStyle, { fontFamily: "mons-e", fontSize: Dims.iputtextsize }]}>{item.label}</Text>
                                                                    </View>
                                                                );
                                                            }}
                                                            showsVerticalScrollIndicator={false}
                                                            dropdownStyle={dropdown.dropdownMenuStyle}
                                                            defaultValue={values.genre}
                                                        />
                                                    </View>
                                                </View>
                                                {errors.genre && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor }}>{errors.genre}</Text>}
                                            </View>

                                            {/* <View style={{ width: "85%", alignSelf: "center", height: 65, flexDirection: "column", marginTop: Dims.bigradius }}>
                                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Province <Text style={{ color: Colors.whiteColor }}>*</Text></Text>
                                                <View style={inputGroup.container}>
                                                    <View style={[inputGroup.inputcontainer, { width: "100%" }]}>
                                                        <SelectDropdown
                                                            search
                                                            // searchInputStyle={{ fon }}
                                                            data={[]}
                                                            onSelect={(selectedItem, index) => {
                                                                // console.log(selectedItem, index);
                                                                const { __tbl_ecom_souscategory, __tbl_ecom_category, __tbl_ecom_unitesmesure, id } = selectedItem
                                                                // setunity(asunity)
                                                                handleChange('idprovince')(`${id}`)
                                                                // alert(id)
                                                            }}
                                                            renderButton={(selectedItem, isOpened) => {
                                                                return (
                                                                    <View style={[dropdown.dropdownButtonStyle, { width: "100%", backgroundColor: Colors.whiteColor }]}>
                                                                        <Text style={[dropdown.dropdownButtonTxtStyle, { fontFamily: "mons-b", color: Colors.primaryColor }]}>
                                                                            {(selectedItem && selectedItem.produit) || 'Sélectionner une province'}
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

                                            <View style={{ width: "85%", alignSelf: "center", height: 65, flexDirection: "column", marginTop: Dims.bigradius }}>
                                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Territoire <Text style={{ color: Colors.whiteColor }}>*</Text></Text>
                                                <View style={inputGroup.container}>
                                                    <View style={[inputGroup.inputcontainer, { width: "100%" }]}>
                                                        <SelectDropdown
                                                            search
                                                            // searchInputStyle={{ fon }}
                                                            data={[]}
                                                            onSelect={(selectedItem, index) => {
                                                                // console.log(selectedItem, index);
                                                                const { __tbl_ecom_souscategory, __tbl_ecom_category, __tbl_ecom_unitesmesure, id } = selectedItem
                                                                const { unity: asunity } = __tbl_ecom_unitesmesure
                                                                // setunity(asunity)
                                                                handleChange('idterritoire')(`${id}`)
                                                                // alert(id)
                                                            }}
                                                            renderButton={(selectedItem, isOpened) => {
                                                                return (
                                                                    <View style={[dropdown.dropdownButtonStyle, { width: "100%", backgroundColor: Colors.whiteColor }]}>
                                                                        <Text style={[dropdown.dropdownButtonTxtStyle, { fontFamily: "mons-b", color: Colors.primaryColor }]}>
                                                                            {(selectedItem && selectedItem.produit) || 'Sélectionner un territoire'}
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
                                                {errors.idterritoire && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor }}>{errors.idterritoire}</Text>}
                                            </View> */}

                                            <View style={{ width: "85%", alignSelf: "center", height: 65, flexDirection: "column", marginTop: Dims.bigradius }}>
                                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Village <Text style={{ color: Colors.whiteColor }}>*</Text></Text>
                                                <View style={inputGroup.container}>
                                                    <View style={[inputGroup.inputcontainer, { width: "100%" }]}>
                                                        <SelectDropdown
                                                            search
                                                            // searchInputStyle={{ fon }}
                                                            data={[...villages]}
                                                            onSelect={(selectedItem, index) => {
                                                                // console.log(selectedItem, index);
                                                                const { id } = selectedItem
                                                                // setunity(asunity)
                                                                handleChange('idvillage')(`${id}`)
                                                                // alert(id)
                                                            }}
                                                            renderButton={(selectedItem, isOpened) => {
                                                                return (
                                                                    <View style={[dropdown.dropdownButtonStyle, { width: "100%", backgroundColor: Colors.whiteColor }]}>
                                                                        <Text style={[dropdown.dropdownButtonTxtStyle, { fontFamily: "mons-b", color: Colors.primaryColor }]}>
                                                                            {(selectedItem && selectedItem.village) || 'Sélectionner un village'}
                                                                        </Text>
                                                                        <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="black" />
                                                                    </View>
                                                                );
                                                            }}
                                                            renderItem={(item, index, isSelected) => {
                                                                return (
                                                                    <View style={{ ...dropdown.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                                                        <Text style={[dropdown.dropdownItemTxtStyle, { fontFamily: "mons-e", fontSize: Dims.iputtextsize }]}>{item.village}</Text>
                                                                    </View>
                                                                );
                                                            }}
                                                            defaultValue={values.idvillage}
                                                            showsVerticalScrollIndicator={false}
                                                            dropdownStyle={dropdown.dropdownMenuStyle}
                                                        />
                                                    </View>
                                                </View>
                                                {errors.idvillage && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor }}>{errors.idvillage}</Text>}
                                            </View>

                                            <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                                <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Date de naissance <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                                    <View style={[inputGroup.container, { flexDirection: "row", justifyContent: "space-between" }]}>
                                                        <View style={{ width: "30%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                            <TextInput placeholder='1' maxLength={2} keyboardType={"numeric"} onChangeText={(t) => handleChange('date_production_d')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                        </View>
                                                        <View style={{ width: "30%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                            <TextInput placeholder='1' maxLength={2} keyboardType={"numeric"} onChangeText={(t) => handleChange('date_production_m')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                        </View>
                                                        <View style={{ width: "30%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                            <TextInput placeholder={`${new Date().getFullYear()}`} maxLength={4} keyboardType={"numeric"} onChangeText={(t) => handleChange('date_production_y')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            {(errors.date_production_d || errors.date_production_m || errors.date_production_y) && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.date_production_d || errors.date_production_m || errors.date_production_y}</Text>}
                                        </View>
                                        <View style={{ width: "85%", height: 65, flexDirection: "column", marginVertical: 25, alignItems: "center", alignSelf: "center", marginTop: 50 }}>
                                            <View style={{ flexDirection: "row" }}>
                                                <TouchableHighlight
                                                    onPress={() => {
                                                        handleSubmit()
                                                    }}
                                                    disabled={isloading}
                                                    underlayColor={Colors.primaryColor}
                                                    style={[btn, { width: "100%" }]}
                                                >
                                                    {isloading
                                                        ?
                                                        <Loader />
                                                        :
                                                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Enregitrer</Text>
                                                    }
                                                </TouchableHighlight>
                                            </View>
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.subtitletextsize, marginVertical: 10, color: Colors.dangerColor, textAlign: "center" }}>
                                                {output}
                                            </Text>
                                        </View>
                                    </ScrollView>
                                </>
                            )
                        }}
                    </Formik>
                )}

                {step === 1 && (
                    <View
                        key={8299283}
                        style={{ flexDirection: "column", alignSelf: "center", width: "90%", marginTop: 20, paddingTop: 8, paddingHorizontal: 12, backgroundColor: Colors.whiteColor }}
                    >
                        <View style={{
                            flexDirection: "column",
                            marginTop: 8,
                            marginBottom: 20,
                            alignContent: "center",
                            alignItems: "center"
                        }}>
                            <TextInput
                                placeholder="ex: Daudi"
                                // value={keyword}
                                maxLength={60}
                                returnKeyType="next"
                                onChangeText={text => {
                                    // setkeyword(text);
                                    __onSearch({ k: text })
                                }}
                                style={{
                                    borderColor: Colors.primaryColor,
                                    borderWidth: 1,
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
                            <TouchableHighlight
                                underlayColor={Colors.primaryColor}
                                style={[btn, { backgroundColor: Colors.primaryColor, marginVertical: 20, elevation: 8 }]}
                            // onPress={__onSearch}
                            >
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center", paddingVertical: 5, height: 48 }}>
                                    <Ionicons name='search' color={Colors.whiteColor} size={25} />
                                    <Text style={{ fontFamily: "mons-b", color: Colors.whiteColor, paddingLeft: 12 }}>Chercher</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={{ width: "100%", paddingHorizontal: 0 }}>
                            <FlatList
                                contentContainerStyle={{ paddingBottom: "100%" }}
                                ListEmptyComponent={<EmptyList />}
                                refreshControl={<RefreshControl
                                    colors={[Colors.primaryColor]}
                                    refreshing={isloading}
                                    onRefresh={__onLoad}
                                />}
                                data={list}
                                renderItem={renderItem}
                            />
                        </View>
                    </View>
                )}
            </View>
            {/* ============================================== */}
        </View>
    )
}