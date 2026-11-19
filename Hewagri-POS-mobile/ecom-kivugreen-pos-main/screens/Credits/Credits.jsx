import * as React from 'react'
import { Title } from '../../components/Title/Title'
import { RefreshControl, ScrollView, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Colors } from '../../assets/colors/Colors';
import Snackbar from 'react-native-snackbar';
import SelectDropdown from 'react-native-select-dropdown'
import { btn, dropdown, inputGroup } from '../../assets/styles/Styles';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Entypo, Ionicons } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { EmptyList } from '../../components/Emptylist/com.emptylist';
import { onRunExternalRQST } from '../../services/communications';
import { belongsToThisCooperative, checkIfExpired, decodeBase64, differenceBetweenDates, differenceInMonths, formatDate, genders, randomLongNumber, randomString, unixToDate } from '../../assets/helper/helper.all';
import { BarcodereaderComponenent } from '../../components/Scanner/ScannerComponent';
import { routes } from '../../assets/helper/helper.routes';
import DialogBox from 'react-native-dialogbox';
import DatePicker from 'react-native-date-picker';

export const CreditsScreen = ({ route, navigation }) => {

    const { idcooperative, user, token } = global;
    const { num_enregistrement, phone, sigle, cooperative, adresse, __tbl_ecom_users } = global.coopec || {}
    const [isloading, setisloading] = React.useState();
    const [output, setoutput] = React.useState("");
    const [step, setstep] = React.useState(0);
    const [rescann, setrescann] = React.useState(false)
    const [customer, setcustomer] = React.useState({})
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState(new Date())
    const ref = React.useRef()

    const creditSchema = Yup.object().shape({
        // id_member: Yup.string().required('Sélectionner un membre !'),
        // id_cooperative: Yup.string().required('Sélectionner une coopérative !'),
        // prenom: Yup.string().required('Entre le prenom ici'),
        motif: Yup.string().required('Entre le motif du crédit !'),
        montant: Yup.string().required('Entre le montant du crédit !'),
        currency: Yup.string().required("Entre a dévise !"),
        // currency: Yup.string().required('Sélectionner la dévise'),
        // periode_remboursement: Yup.number().positive().min(1).max(31).required('Entrer le jour'),
        periode_remboursement: Yup.string().required('Entrer la periode de remboursement !'),
        // date_production_y: Yup.number().positive().max(new Date().getFullYear() - 17).required(`Entrer une valeur pour l\'année qui est valide inferieure à ${new Date().getFullYear() - 17}`),
    });

    const __handleSubmit = async ({ values }) => {
        const { id_cooperative, id_member, montant, currency, motif, periode_remboursement } = values;
        const data = {
            ...values,
            id_cooperative: idcooperative,
            id_member: !isNaN(parseInt(customer)) ? parseInt(customer) : undefined,
            periode_remboursement: parseInt(periode_remboursement),
            montant: parseFloat(montant)
        }
        if (isNaN(customer)) delete data['id_member']
        setisloading(true)
        onRunExternalRQST({
            url: '/credits/credit/add',
            data,
            method: "POST",
        }, (err, done) => {
            setisloading(false);
            console.log('====================================');
            console.log(" =====> ", done, err);
            console.log('====================================');
            if (done) {
                const { status, data, message } = done;
                if (status === 200) {
                    Snackbar.show({
                        text: "Enregitrement effectué avec succès !",
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: Colors.successColor
                    });
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
    };

    const tabs = [
        {
            name: 'Pour la coopérative',
            key: 0,
            content: (
                <>
                    <EmptyList />
                </>
            )
        },
        {
            name: 'Pour un membre',
            key: 1,
            content: (
                <>
                    <EmptyList />
                </>
            )
        }
    ];

    React.useEffect(() => {

    }, [])

    return (
        <>
            <Title navigation={navigation} title={"Demande de crédit"} subtitle={"Formulaire de demande de crédit"} />
            <View style={{ backgroundColor: Colors.whiteColor }}>
                <View style={{ width: "85%", alignSelf: "center", position: "absolute", top: 15, flex: 1, zIndex: 100, flexDirection: "column" }}>
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
                            // alert(selectedSegmentIndex)
                            // if (selectedSegmentIndex === 1) navigation.navigate(routes['qrcodereader'])
                        }}
                        activeStyle={{ borderRadius: 40 }}
                    />
                </View>
                <>
                    {step === 0 && (
                        <View style={{ flexDirection: "column", alignSelf: "center", width: "100%", marginTop: 50, paddingTop: 8, paddingHorizontal: 5, backgroundColor: Colors.whiteColor }}>
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
                            <ScrollView
                                contentContainerStyle={{ paddingBottom: "100%", backgroundColor: Colors.whiteColor }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                            >
                                <Formik
                                    key={2002}
                                    initialValues={{
                                        key: 2002,
                                        id_cooperative: idcooperative,
                                        id_member: customer,
                                        montant: '',
                                        currency: '',
                                        motif: '',
                                        periode_remboursement: '',
                                        // date_production_d: '',
                                        // date_production_m: '',
                                        // date_production_y: '',
                                    }}
                                    validationSchema={creditSchema}
                                    onSubmit={values => __handleSubmit({ values })}
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
                                        return (
                                            <>
                                                {/* -------------------------- */}
                                                <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor, height: "auto", marginTop: 0 }}>
                                                    {customer.length > 0 && (
                                                        <>
                                                            <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                                                <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Membre <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                                                    <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                                                        <View style={{ width: "20%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                                                            <Text style={{ alignSelf: "center", fontFamily: "mons-b", color: Colors.primaryColor }}>{""}</Text>
                                                                        </View>
                                                                        <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                                            <TextInput editable={false} value={String("**********").concat(values.id_member)} placeholder='1' maxLength={50} keyboardType={"numeric"} onChangeText={(t) => handleChange('id_member')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            {errors.id_member && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.id_member}</Text>}
                                                        </>
                                                    )}

                                                    <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                                        <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Montant de crédit <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
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
                                                                    <TextInput placeholder='1000' maxLength={50} keyboardType={"numeric"} onChangeText={(t) => handleChange('montant')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    {(errors.montant || errors.currency) && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.montant || errors.currency}</Text>}

                                                    <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                                        <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Motif de crédit <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                                            <View style={[inputGroup.container, { flexDirection: "row-reverse" }]}>
                                                                <View style={{ width: "20%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                                                    <Text style={{ alignSelf: "center", fontFamily: "mons-b", color: Colors.primaryColor }}>{""}</Text>
                                                                </View>
                                                                <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                                    <TextInput disabled={true} multiline placeholder='Motif du crédit' maxLength={50} keyboardType={"default"} onChangeText={(t) => handleChange('motif')(`${t}`)} style={[inputGroup.input, { fontFamily: "mons", width: "100%" }]} />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    {errors.motif && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 25 }}>{errors.motif}</Text>}
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
                                                            setDate(date)
                                                            const __ = differenceInMonths({ date1: new Date(), date2: date })
                                                            handleChange('periode_remboursement')(`${__}`)
                                                        }}
                                                        onCancel={() => {
                                                            setOpen(false)
                                                        }}
                                                    />
                                                    {/* ====================================================================== */}
                                                    <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius, marginBottom: 20 }}>
                                                        <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Période de remoboursement <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                                            <TouchableHighlight underlayColor={Colors.whiteColor} style={[inputGroup.container, { flexDirection: "row-reverse", width: "100%" }]} onPress={() => { setOpen(!open) }} >
                                                                <View style={{ width: "100%", justifyContent: "flex-start", paddingLeft: 20, alignContent: "flex-start", alignItems: "center", flexDirection: "row" }}>
                                                                    <Text style={{ fontFamily: "mons", color: Colors.primaryColor }}>{values.periode_remboursement ? String(values.periode_remboursement).concat(" Mois") : "Sélectionner une période"}</Text>
                                                                </View>
                                                            </TouchableHighlight>
                                                        </View>
                                                    </View>
                                                    {errors.periode_remboursement && <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.dangerColor, alignSelf: "center", width: "85%", marginTop: 5 }}>{errors.periode_remboursement}</Text>}
                                                </View>
                                                <View style={{ width: "85%", height: 65, flexDirection: "column", marginVertical: 25, alignItems: "center", alignSelf: "center", marginTop: 50 }}>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <TouchableHighlight
                                                            onPress={handleSubmit}
                                                            disabled={isloading}
                                                            underlayColor={Colors.primaryColor}
                                                            style={[btn, { width: "100%" }]}
                                                        >
                                                            <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Confirmer</Text>
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
                            </ScrollView>
                        </View>
                    )}

                    {step === 1 && (
                        <View style={{ width: "100%", height: Dims.height }}>
                            <BarcodereaderComponenent
                                navigation={navigation}
                                key={randomLongNumber({ length: 6 })}
                                rescann={rescann}
                                cb={(d) => {

                                    setrescann(false)
                                    const { data, target, type } = d;
                                    const str = decodeBase64({ string: data });
                                    if (str !== false) {
                                        const [expiresin, id_customer, id_coopec] = String(str).split(".");
                                        if (expiresin && id_customer && id_coopec) {
                                            if (belongsToThisCooperative({ id_cooperative: id_coopec })) {
                                                if (!checkIfExpired({ unix: expiresin })) {
                                                    // setcustomer(id_customer)
                                                    onRunExternalRQST({
                                                        method: "GET",
                                                        url: `/users/user/${id_customer}`,
                                                    }, (err, done) => {
                                                        if (done) {
                                                            const { status, message, data } = done;
                                                            if (status === 200) {
                                                                setcustomer(data)
                                                                setstep(0)
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
                                                } else {
                                                    ref.current.confirm({
                                                        title: <Text style={{ fontFamily: "mons" }}>Carte expirée</Text>,
                                                        content: [<Text style={{ fontFamily: "mons-e" }}>Cette opération ne peut être effectuer car la carte a déjà expiée; sa date d'expiration est <Text style={{ fontFamily: "mons" }}>{unixToDate({ unix: expiresin })}</Text> essayer avec une autre carte</Text>],
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
                                            }
                                        } else {
                                            ref.current.confirm({
                                                title: <Text style={{ fontFamily: "mons" }}>Lecteur QR Code</Text>,
                                                content: [<Text style={{ fontFamily: "mons" }}>Le QRCode scanné est incorrect, veuillez scanner un QRCode qui est correcte</Text>],
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
                                                    callback: () => navigation.navigate("tabs")
                                                }
                                            })
                                        }
                                    } else {
                                        ref.current.confirm({
                                            title: <Text style={{ fontFamily: "mons" }}>Lecteur QR Code</Text>,
                                            content: [<Text style={{ fontFamily: "mons" }}>Le QRCode scanné est incorrect, veuillez scanner un QRCode qui est correcte</Text>],
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
                                                callback: () => navigation.navigate("tabs")
                                            }
                                        })
                                    }
                                }}
                            />
                        </View>
                    )}
                </>
            </View>
            <DialogBox ref={ref} isOverlayClickClose={false} />
        </>
    )
}