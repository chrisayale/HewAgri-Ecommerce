import * as React from 'react'
import { Title } from '../../components/Title/Title'
import { RefreshControl, Text, TextInput, TouchableHighlight, View, Platform, KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import { Dims } from '../../assets/dimensions/Dimemensions';
import DialogBox from 'react-native-dialogbox';
import Snackbar from 'react-native-snackbar';
import SelectDropdown from 'react-native-select-dropdown'
import {
  btnPrimary,
  btnPrimaryLg,
  btnGhost,
  btnGhostLg,
  btnOutline,
  btnOutlineLg,
  input,
  inputLabel,
  inputErrorText,
  inputHelperText,
  inputGroup,
  dropdown,
  card,
  cardElevated,
  cardOutlined,
  fieldGroup,
  fieldRow,
  fieldRowItem,
  divider,
  dividerVertical,
  text,
  flexRow,
  flexRowBetween,
  flexRowCenter,
  flexCol,
  flexColCenter,
  gridContainer,
  gridItem,
  gridItemFull,
  gridItemThird,
  gridItemQuarter,
  screenContainer,
  screenContainerCentered,
  section,
  sectionTitle,
  sectionSubtitle,
  touchableOpacity,
  Spacing,
  BorderRadius,
  Shadows,
  Colors,
  ComponentTokens,
} from '../../assets/styles/Styles';
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
import { Loader } from '../../components/Loader/comp.loader';
import { useWindowDimensions } from 'react-native';

export const AddmemberScreen = ({ route, navigation }) => {

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && width > 768;
  const isTablet = isWeb && width >= 768 && width < 1024;

  const formMaxWidth = isDesktop ? 680 : isTablet ? 600 : '100%';
  const formPadding = isDesktop ? 32 : isTablet ? 24 : 16;
  const inputHeight = ComponentTokens.input.height.md;
  const labelFontSize = isWeb ? 14 : 14;
  const inputFontSize = isWeb ? 14 : 16;

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
      'Le numéro doit commencer par +243 ou 0 et être suivi d\'un préfixe valide (81, 82, 83, etc.).'
    ),
    genre: Yup.string().required('Selectionner le sexe'),
    hectare_cultive: Yup.number().required("Entre l'hectare cultivé par l'agriculteur"),
    // currency: Yup.string().required('Sélectionner la dévise'),
    date_production_d: Yup.number().positive().min(1).max(31).required('Entrer le jour de naissance'),
    date_production_m: Yup.number().positive().min(1).max(12).required('Entrer le mois de naissance'),
    date_production_y: Yup.number().positive().min(new Date().getFullYear() - 100).max(new Date().getFullYear() - 17).required(`Entrer une valeur pour l'année qui est valide inferieure à ${new Date().getFullYear() - 17}`),
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
            text: "Enregistrement effectué avec succès !",
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

  const renderItem = ({ item, index }) => {
    const { carte, createdAt, date_expiration, date_expiration_unix, id: asid, updatedAt, __tbl_ecom_user, __tbl_ecom_cooperative } = item;
    const { email, id, nom, postnom, phone, prenom } = __tbl_ecom_user;
    const { sigle, cooperative } = __tbl_ecom_cooperative;
    const isWebView = Platform.OS === 'web';
    const itemFontSize = isWebView ? 13 : 14;
    const itemTitleFontSize = isWebView ? 16 : 18;

    return (
      <View style={{
        width: "100%",
        padding: isWebView ? 16 : 12,
        backgroundColor: Colors.pillColor,
        elevation: isWebView ? 2 : 5,
        marginTop: isWebView ? 8 : 15,
        flexDirection: "row",
        alignItems: "flex-start",
        borderRadius: isWebView ? 8 : 0,
        ...Shadows.shadow.sm,
      }}>
        <View style={{ width: "90%", paddingRight: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <View>
              <Text style={{ fontFamily: "mons-e", fontSize: itemTitleFontSize }}>ID: <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{asid}</Text></Text>
              <Text style={{ fontFamily: "mons-e", fontSize: itemFontSize }}>Coopec: <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{cooperative}</Text></Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontFamily: "mons-e", fontSize: itemFontSize }}>Membre depuis</Text>
              <Text style={{ fontFamily: "mons-b", fontSize: itemFontSize }}>{formatDate({ date: createdAt })}</Text>
            </View>
          </View>
          <Divider style={{ marginVertical: 8 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <View style={{ marginTop: isWebView ? 4 : 10, minWidth: "40%" }}>
              <Text style={{ fontFamily: "mons-e", fontSize: itemFontSize }}>Nom: <Text style={{ fontFamily: "mons-b" }}>{nom}</Text></Text>
              <Text style={{ fontFamily: "mons-e", fontSize: itemFontSize }}>Postnom: <Text style={{ fontFamily: "mons-b" }}>{postnom}</Text></Text>
              <Text style={{ fontFamily: "mons-e", fontSize: itemFontSize }}>Prénom: <Text style={{ fontFamily: "mons-b" }}>{prenom}</Text></Text>
            </View>
            <View style={{ marginTop: isWebView ? 4 : 10, minWidth: "50%" }}>
              <Text style={{ fontFamily: "mons-e", fontSize: itemFontSize }}>Télé.: <Text style={{ fontFamily: "mons-b" }}>{phone}</Text></Text>
              <Text style={{ fontFamily: "mons-e", fontSize: itemFontSize }}>Email: <Text style={{ fontFamily: "mons-b" }}>{email}</Text></Text>
              <Text style={{ fontFamily: "mons-e", fontSize: itemFontSize }}>Exp.: <Text style={{ fontFamily: "mons-b", color: Colors.dangerColor }}>{unixToDate({ unix: date_expiration_unix })}</Text></Text>
            </View>
          </View>
        </View>
        <View style={{ width: "10%", alignContent: "center", alignItems: "center", justifyContent: "center", backgroundColor: Colors.pillColor }}>
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
    <View style={{ flex: 1, backgroundColor: Colors.background.primary }}>
      <Title navigation={navigation} title={"Ajout membre"} subtitle={"Formulaire d'ajout d'un membre"} />
      <View style={{ width: formMaxWidth, alignSelf: "center", marginTop: isWeb ? 16 : 80, paddingHorizontal: formPadding }}>
        <View style={{ marginBottom: isWeb ? 16 : 24 }}>
          <SegmentedControl
            tintColor={Colors.whiteColor}
            style={{
              height: isWeb ? 44 : 52,
              borderRadius: isWeb ? 8 : BorderRadius.md,
              elevation: isWeb ? 0 : 4,
              boxShadow: isWeb ? '0 2px 8px rgba(0,0,0,0.08)' : undefined,
              backgroundColor: Colors.primary[500],
              ...Shadows.shadow.sm,
            }}
            backgroundColor={Colors.primary[500]}
            fontStyle={{
              fontFamily: "mons-e",
              color: Colors.whiteColor,
              fontSize: isWeb ? 13 : 14
            }}
            onValueChange={(v) => { }}
            tabStyle={{
              height: isWeb ? 44 : 52,
              borderRadius: isWeb ? 6 : BorderRadius.sm,
            }}
            appearance='light'
            activeFontStyle={{
              fontFamily: "mons-e",
              color: Colors.primary[500],
              fontSize: isWeb ? 13 : 14
            }}
            values={[...Array.from(tabs).map(t => t['name'])]}
            selectedIndex={step}
            onChange={(event) => {
              const { nativeEvent } = event;
              const { selectedSegmentIndex } = nativeEvent;
              setstep(selectedSegmentIndex)
            }}
            activeStyle={{ borderRadius: isWeb ? 6 : 12, backgroundColor: Colors.whiteColor }}
          />
        </View>
      </View>
      <View style={{ width: "100%", paddingTop: isWeb ? 16 : 40 }}>
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
                  <KeyboardAvoidingView
                    behavior={isWeb ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={isWeb ? 0 : 100}
                  >
                    <ScrollView
                      contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: formPadding }}
                      showsVerticalScrollIndicator={false}
                      refreshControl={<RefreshControl
                        colors={[Colors.primary[500]]}
                        refreshing={isloading}
                        onRefresh={() => { }}
                      />}
                    >
                      <View style={{ width: formMaxWidth, alignSelf: 'center', marginTop: isWeb ? 16 : 24 }}>

                        {/* Section: Informations personnelles */}
                        <View style={section}>
                          <Text style={sectionTitle}>Informations personnelles</Text>
                          <Text style={sectionSubtitle}>Remplissez les champs obligatoires marqués d'un *</Text>

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Nom <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                            <TextInput
                              value={values.nom}
                              placeholder='Nom'
                              maxLength={50}
                              keyboardType={"default"}
                              autoCapitalize="words"
                              onChangeText={(t) => handleChange('nom')(`${t}`)}
                              style={[input, { fontFamily: "mons", width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                            />
                          </View>
                          {errors.nom && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.nom}</Text>}

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Postnom <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                            <TextInput
                              value={values.postnom}
                              placeholder='Postnom'
                              maxLength={50}
                              keyboardType={"default"}
                              autoCapitalize="words"
                              onChangeText={(t) => handleChange('postnom')(`${t}`)}
                              style={[input, { fontFamily: "mons", width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                            />
                          </View>
                          {errors.postnom && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.postnom}</Text>}

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Prénom</Text>
                            <TextInput
                              value={values.prenom}
                              placeholder='Prénom'
                              maxLength={50}
                              keyboardType={"default"}
                              autoCapitalize="words"
                              onChangeText={(t) => handleChange('prenom')(`${t}`)}
                              style={[input, { fontFamily: "mons", width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                            />
                          </View>
                          {errors.prenom && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.prenom}</Text>}
                        </View>

                        {/* Section: Contact */}
                        <View style={section}>
                          <Text style={sectionTitle}>Contact</Text>

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Téléphone <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                            <TextInput
                              value={values.phone}
                              placeholder='+243 81 23 45 67'
                              maxLength={50}
                              keyboardType={"number-pad"}
                              onChangeText={(t) => handleChange('phone')(`${t}`)}
                              style={[input, { fontFamily: "mons", width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                            />
                          </View>
                          {errors.phone && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.phone}</Text>}

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Adresse email</Text>
                            <TextInput
                              value={values.email}
                              placeholder='email@exemple.com'
                              maxLength={50}
                              keyboardType={"email-address"}
                              autoCapitalize="none"
                              autoComplete="email"
                              onChangeText={(t) => handleChange('email')(`${t}`)}
                              style={[input, { fontFamily: "mons", width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                            />
                          </View>
                          {errors.email && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.email}</Text>}
                        </View>

                        {/* Section: Détails agricoles */}
                        <View style={section}>
                          <Text style={sectionTitle}>Détails agricoles</Text>

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Hectare cultivé</Text>
                            <TextInput
                              value={values.hectare_cultive}
                              placeholder='1.5'
                              maxLength={50}
                              keyboardType={"numeric"}
                              onChangeText={(t) => handleChange('hectare_cultive')(`${t}`)}
                              style={[input, { fontFamily: "mons", width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                            />
                          </View>
                          {errors.hectare_cultive && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.hectare_cultive}</Text>}
                        </View>

                        {/* Section: Sexe et Village */}
                        <View style={section}>
                          <Text style={sectionTitle}>Profil</Text>

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Sexe <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                            <View style={inputGroup.container}>
                              <View style={[inputGroup.inputcontainer, { width: "100%" }]}>
                                <SelectDropdown
                                  data={[...genders]}
                                  onSelect={(selectedItem, index) => {
                                    const { id } = selectedItem
                                    handleChange('genre')(`${id}`)
                                  }}
                                  renderButton={(selectedItem, isOpened) => {
                                    return (
                                      <View style={{ ...dropdown.dropdownButtonStyle, width: "100%", backgroundColor: Colors.whiteColor, height: inputHeight }}>
                                        <Text style={{ ...dropdown.dropdownButtonTxtStyle, fontFamily: "mons-b", color: Colors.primaryColor, fontSize: inputFontSize }}>
                                          {(selectedItem && selectedItem.label) || 'Sélectionner le sexe'}
                                        </Text>
                                        <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="black" />
                                      </View>
                                    );
                                  }}
                                  renderItem={(item, index, isSelected) => {
                                    return (
                                      <View style={{ ...dropdown.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                        <Text style={{ ...dropdown.dropdownItemTxtStyle, fontFamily: "mons-e", fontSize: inputFontSize }}>{item.label}</Text>
                                      </View>
                                    );
                                  }}
                                  showsVerticalScrollIndicator={false}
                                  dropdownStyle={dropdown.dropdownMenuStyle}
                                  defaultValue={values.genre}
                                />
                              </View>
                            </View>
                            {errors.genre && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.genre}</Text>}
                          </View>

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Village <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                            <View style={inputGroup.container}>
                              <View style={[inputGroup.inputcontainer, { width: "100%" }]}>
                                <SelectDropdown
                                  search
                                  data={[...villages]}
                                  onSelect={(selectedItem, index) => {
                                    const { id } = selectedItem
                                    handleChange('idvillage')(`${id}`)
                                  }}
                                  renderButton={(selectedItem, isOpened) => {
                                    return (
                                      <View style={{ ...dropdown.dropdownButtonStyle, width: "100%", backgroundColor: Colors.whiteColor, height: inputHeight }}>
                                        <Text style={{ ...dropdown.dropdownButtonTxtStyle, fontFamily: "mons-b", color: Colors.primaryColor, fontSize: inputFontSize }}>
                                          {(selectedItem && selectedItem.village) || 'Sélectionner un village'}
                                        </Text>
                                        <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="black" />
                                      </View>
                                    );
                                  }}
                                  renderItem={(item, index, isSelected) => {
                                    return (
                                      <View style={{ ...dropdown.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                        <Text style={{ ...dropdown.dropdownItemTxtStyle, fontFamily: "mons-e", fontSize: inputFontSize }}>{item.village}</Text>
                                      </View>
                                    );
                                  }}
                                  defaultValue={values.idvillage}
                                  showsVerticalScrollIndicator={false}
                                  dropdownStyle={dropdown.dropdownMenuStyle}
                                />
                              </View>
                            </View>
                            {errors.idvillage && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.idvillage}</Text>}
                          </View>
                        </View>

                        {/* Section: Date de naissance */}
                        <View style={section}>
                          <Text style={sectionTitle}>Date de naissance <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                            <View style={{ flex: 1 }}>
                              <View style={fieldGroup}>
                                <Text style={[inputLabel, { fontSize: labelFontSize }]}>Jour</Text>
                                <TextInput
                                  placeholder='JJ'
                                  maxLength={2}
                                  keyboardType={"numeric"}
                                  onChangeText={(t) => handleChange('date_production_d')(`${t}`)}
                                  style={[input, { fontFamily: "mons", width: "100%", height: inputHeight, fontSize: inputFontSize, textAlign: 'center' }]}
                                />
                              </View>
                              {errors.date_production_d && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.date_production_d}</Text>}
                            </View>
                            <View style={{ flex: 1 }}>
                              <View style={fieldGroup}>
                                <Text style={[inputLabel, { fontSize: labelFontSize }]}>Mois</Text>
                                <TextInput
                                  placeholder='MM'
                                  maxLength={2}
                                  keyboardType={"numeric"}
                                  onChangeText={(t) => handleChange('date_production_m')(`${t}`)}
                                  style={[input, { fontFamily: "mons", width: "100%", height: inputHeight, fontSize: inputFontSize, textAlign: 'center' }]}
                                />
                              </View>
                              {errors.date_production_m && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.date_production_m}</Text>}
                            </View>
                            <View style={{ flex: 1 }}>
                              <View style={fieldGroup}>
                                <Text style={[inputLabel, { fontSize: labelFontSize }]}>Année</Text>
                                <TextInput
                                  placeholder={`AAAA`}
                                  maxLength={4}
                                  keyboardType={"numeric"}
                                  onChangeText={(t) => handleChange('date_production_y')(`${t}`)}
                                  style={[input, { fontFamily: "mons", width: "100%", height: inputHeight, fontSize: inputFontSize, textAlign: 'center' }]}
                                />
                              </View>
                              {errors.date_production_y && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.date_production_y}</Text>}
                            </View>
                          </View>
                        </View>

                        {/* Submit Button */}
                        <View style={{ width: "100%", marginTop: 24, marginBottom: 40 }}>
                          <TouchableHighlight
                            onPress={() => {
                              handleSubmit()
                            }}
                            disabled={isloading}
                            underlayColor={Colors.primary[600]}
                            style={[btnPrimaryLg, { width: "100%", height: inputHeight }]}
                            activeOpacity={0.9}
                          >
                            {isloading
                              ?
                              <Loader />
                              :
                              <Text style={{ color: Colors.whiteColor, fontFamily: "mons", fontSize: inputFontSize, fontWeight: '600' }}>Enregistrer</Text>
                          }
                          </TouchableHighlight>
                          {output && (
                            <Text style={{ fontFamily: "mons", fontSize: 13, marginTop: 10, color: Colors.danger.main, textAlign: "center" }}>
                              {output}
                            </Text>
                          )}
                        </View>
                      </View>
                    </ScrollView>
                  </KeyboardAvoidingView>
                </>
              )
            }}
          </Formik>
        )}

        {step === 1 && (
          <KeyboardAvoidingView
            behavior={isWeb ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={isWeb ? 0 : 100}
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: formPadding }}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl
                colors={[Colors.primary[500]]}
                refreshing={isloading}
                onRefresh={__onLoad}
              />}
            >
              <View style={{ width: formMaxWidth, alignSelf: 'center', marginTop: isWeb ? 16 : 24 }}>
                <View style={section}>
                  <Text style={sectionTitle}>Rechercher un membre existant</Text>
                  <Text style={sectionSubtitle}>Entrez un nom pour rechercher dans la base de données</Text>

                  <View style={fieldGroup}>
                    <TextInput
                      placeholder="ex: Daudi"
                      maxLength={60}
                      returnKeyType="next"
                      onChangeText={text => {
                        __onSearch({ k: text })
                      }}
                      style={{
                        borderColor: Colors.primary[500],
                        borderWidth: 1,
                        backgroundColor: Colors.surface.primary,
                        paddingHorizontal: 20,
                        height: inputHeight,
                        borderRadius: BorderRadius.input,
                        fontFamily: "mons-b",
                        width: "100%",
                        color: Colors.primary[500],
                        fontSize: inputFontSize
                      }}
                    />
                  </View>
                  <TouchableHighlight
                    underlayColor={Colors.primary[600]}
                    style={[btnPrimaryLg, { backgroundColor: Colors.primary[500], marginVertical: 16, elevation: 4, height: inputHeight, ...Shadows.shadow.sm }]}
                    activeOpacity={0.9}
                  >
                    <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center", paddingVertical: 5, height: "100%" }}>
                      <Ionicons name='search' color={Colors.whiteColor} size={22} />
                      <Text style={{ fontFamily: "mons-b", color: Colors.whiteColor, paddingLeft: 10, fontSize: inputFontSize, fontWeight: '600' }}>Chercher</Text>
                    </View>
                  </TouchableHighlight>
                  <View style={{ width: "100%", marginTop: 16 }}>
                    <FlatList
                      contentContainerStyle={{ paddingBottom: 40 }}
                      ListEmptyComponent={<EmptyList />}
                      data={list}
                      renderItem={renderItem}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </View>
      {/* ============================================== */}
    </View>
  )
}