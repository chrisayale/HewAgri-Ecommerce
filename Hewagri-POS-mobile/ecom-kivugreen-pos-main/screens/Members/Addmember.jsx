import * as React from 'react'
import { Title } from '../../components/Title/Title'
import { RefreshControl, Text, TextInput, TouchableHighlight, TouchableOpacity, View, Platform, KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
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
  Typography,
  Layout,
  Responsive,
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
  const isDesktop = isWeb && width >= 1024;
  const isTablet = isWeb && width >= 768 && width < 1024;
  const isMobile = !isDesktop && !isTablet;

  // Responsive container sizing
  const formMaxWidth = isDesktop ? 800 : isTablet ? 680 : '100%';
  const formPadding = isDesktop ? 32 : isTablet ? 24 : 16;
  const innerPadding = isDesktop ? 24 : isTablet ? 16 : 12;

  // Responsive heights and fonts
  const inputHeight = isDesktop ? ComponentTokens.input.height.lg :
                      isTablet ? ComponentTokens.input.height.md :
                      ComponentTokens.input.height.md;
  const labelFontSize = Typography.fontSize.sm;
  const inputFontSize = isDesktop ? Typography.fontSize.base :
                        isTablet ? Typography.fontSize.base :
                        Typography.fontSize.md;
  const titleFontSize = isDesktop ? Typography.fontSize['2xl'] :
                        isTablet ? Typography.fontSize.xl :
                        Typography.fontSize.xl;
  const buttonHeight = isDesktop ? ComponentTokens.button.height.lg :
                       isTablet ? ComponentTokens.button.height.md :
                       ComponentTokens.button.height.md;

  // Two-column layout on desktop/tablet for field pairs
  const useTwoColumns = isDesktop || isTablet;

  // ScrollView content container style - ensures proper scrolling on all platforms
  const scrollContentStyle = {
    flexGrow: 1,
    paddingBottom: Spacing['3xl'], // Extra bottom padding for keyboard avoidance and submit button
    paddingHorizontal: formPadding,
    minHeight: height - (isWeb ? 120 : 200), // Ensure minimum height for scrolling
  };

  const { idcooperative, user, token } = global;
  const [isloading, setisloading] = React.useState();
  const [output, setoutput] = React.useState("");
  const [step, setstep] = React.useState(0);
  const [list, setlist] = React.useState([])
  const [temps, settemps] = React.useState([]);
  const [keyword, setkeyword] = React.useState("");
  const [villages, setvillages] = React.useState([])
  const [showCustomCropInput, setShowCustomCropInput] = React.useState(false);
  const [customCropValue, setCustomCropValue] = React.useState('');

  // Staple crops list for multi-selection
  const STAPLE_CROPS = [
    'Maïs',
    'Haricot',
    'Manioc',
    'Pomme de terre',
    'Riz',
    'Café',
    'Cacao',
    'Banane',
    'Soja',
  ];

  // Marital status options
  const MARITAL_STATUSES = [
    { id: 'celibataire', label: 'Célibataire' },
    { id: 'marie', label: 'Marié(e)' },
    { id: 'veuf', label: 'Veuf/Veuve' },
    { id: 'divorce', label: 'Divorcé(e) / Séparé(e)' },
  ];

  // Farming type options
  const FARMING_TYPES = [
    { id: 'pluviale', label: 'Agriculture pluviale' },
    { id: 'irrigation', label: 'Irrigation' },
    { id: 'climat', label: "Adaptée au climat" },
    { id: 'moderne', label: 'Moderne (sous serre, intelligente, etc.)' },
  ];

  const memberSchemas = Yup.object().shape({
    nom: Yup.string().required('Entre le nom ici'),
    postnom: Yup.string().required('Entre le postnom ici'),
    // prenom: Yup.string().required('Entre le prenom ici'),
    phone: Yup.string().required('Entre le numéro de téléphone').matches(
      /^(?:\+243|0)(81|82|83|84|85|89|97|99|98)\d{7}$/,
      'Le numéro doit commencer par +243 ou 0 et être suivi d\'un préfixe valide (81, 82, 83, etc.).'
    ),
    genre: Yup.string().required('Selectionner le sexe'),
    hectare_cultive: Yup.number().required("Entre l'hectare cultivé par l'agriculteur").transform((value, originalValue) => {
      if (typeof originalValue === 'string' && originalValue.trim() !== '') {
        return parseFloat(originalValue);
      }
      return value;
    }),
    // currency: Yup.string().required('Sélectionner la dévise'),
    date_production_d: Yup.number().positive().min(1).max(31).required('Entrer le jour de naissance').transform((value, originalValue) => {
      if (typeof originalValue === 'string' && originalValue.trim() !== '') {
        return parseInt(originalValue, 10);
      }
      return value;
    }),
    date_production_m: Yup.number().positive().min(1).max(12).required('Entrer le mois de naissance').transform((value, originalValue) => {
      if (typeof originalValue === 'string' && originalValue.trim() !== '') {
        return parseInt(originalValue, 10);
      }
      return value;
    }),
    date_production_y: Yup.number().positive().min(new Date().getFullYear() - 100).max(new Date().getFullYear() - 17).required(`Entrer une valeur pour l'année qui est valide inferieure à ${new Date().getFullYear() - 17}`).transform((value, originalValue) => {
      if (typeof originalValue === 'string' && originalValue.trim() !== '') {
        return parseInt(originalValue, 10);
      }
      return value;
    }),
    culturesPhares: Yup.array().of(Yup.string()),
    etatCivil: Yup.string(),
    nombreEnfants: Yup.number().integer().min(0).transform((value, originalValue) => {
      if (typeof originalValue === 'string' && originalValue.trim() !== '') {
        return parseInt(originalValue, 10);
      }
      return value;
    }),
    typeAgriculture: Yup.array().of(Yup.string()),
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
    const itemFontSize = isWebView ? Typography.fontSize.sm : Typography.fontSize.md;
    const itemTitleFontSize = isWebView ? Typography.fontSize.lg : Typography.fontSize.xl;

    return (
      <View style={{
        width: "100%",
        padding: isWebView ? Spacing.md : Spacing.lg,
        backgroundColor: Colors.surface.primary,
        elevation: isWebView ? 0 : 4,
        marginTop: isWebView ? Spacing.sm : Spacing.md,
        flexDirection: "row",
        alignItems: "flex-start",
        borderRadius: isWebView ? BorderRadius.md : 0,
        ...(isWebView ? Shadows.shadow.sm : Shadows.shadow.md),
      }}>
        <View style={{ width: "90%", paddingRight: Spacing.md }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: Spacing.sm }}>
            <View>
              <Text style={{ fontFamily: Typography.fontFamily.medium, fontSize: itemTitleFontSize }}>ID: <Text style={{ fontFamily: Typography.fontFamily.bold, color: Colors.primary[500] }}>{asid}</Text></Text>
              <Text style={{ fontFamily: Typography.fontFamily.medium, fontSize: itemFontSize }}>Coopec: <Text style={{ fontFamily: Typography.fontFamily.bold, color: Colors.primary[500] }}>{cooperative}</Text></Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontFamily: Typography.fontFamily.medium, fontSize: itemFontSize }}>Membre depuis</Text>
              <Text style={{ fontFamily: Typography.fontFamily.bold, fontSize: itemFontSize }}>{formatDate({ date: createdAt })}</Text>
            </View>
          </View>
          <Divider style={{ marginVertical: Spacing.sm }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: Spacing.md }}>
            <View style={{ marginTop: isWebView ? Spacing.xs : Spacing.sm, minWidth: useTwoColumns ? "45%" : "100%" }}>
              <Text style={{ fontFamily: Typography.fontFamily.medium, fontSize: itemFontSize }}>Nom: <Text style={{ fontFamily: Typography.fontFamily.bold }}>{nom}</Text></Text>
              <Text style={{ fontFamily: Typography.fontFamily.medium, fontSize: itemFontSize }}>Postnom: <Text style={{ fontFamily: Typography.fontFamily.bold }}>{postnom}</Text></Text>
              <Text style={{ fontFamily: Typography.fontFamily.medium, fontSize: itemFontSize }}>Prénom: <Text style={{ fontFamily: Typography.fontFamily.bold }}>{prenom}</Text></Text>
            </View>
            <View style={{ marginTop: isWebView ? Spacing.xs : Spacing.sm, minWidth: useTwoColumns ? "50%" : "100%" }}>
              <Text style={{ fontFamily: Typography.fontFamily.medium, fontSize: itemFontSize }}>Télé.: <Text style={{ fontFamily: Typography.fontFamily.bold }}>{phone}</Text></Text>
              <Text style={{ fontFamily: Typography.fontFamily.medium, fontSize: itemFontSize }}>Email: <Text style={{ fontFamily: Typography.fontFamily.bold }}>{email}</Text></Text>
              <Text style={{ fontFamily: Typography.fontFamily.medium, fontSize: itemFontSize }}>Exp.: <Text style={{ fontFamily: Typography.fontFamily.bold, color: Colors.danger.main }}>{unixToDate({ unix: date_expiration_unix })}</Text></Text>
            </View>
          </View>
        </View>
        <View style={{ width: "10%", alignContent: "center", alignItems: "center", justifyContent: "center", backgroundColor: Colors.surface.primary }}>
          <Entypo name="chevron-right" size={24} color={Colors.primary[500]} />
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

  // Helper component for responsive field row
  const ResponsiveFieldRow = ({ children, style, ...props }) => (
    <View style={[fieldRow, useTwoColumns ? { flexDirection: 'row', gap: Spacing.md } : { flexDirection: 'column', gap: 0 }, style]} {...props}>
      {children}
    </View>
  );

  // Helper for field row item (half width on desktop/tablet)
  const FieldRowItem = ({ children, style, ...props }) => (
    <View style={[fieldRowItem, useTwoColumns ? { flex: 1, minWidth: 0 } : { width: '100%' }, style]} {...props}>
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background.primary }}>
      <Title navigation={navigation} title={"Ajout membre"} subtitle={"Formulaire d'ajout d'un membre"} />

      {/* Tab Bar */}
      <View style={{ width: formMaxWidth, alignSelf: "center", marginTop: isWeb ? Spacing.md : Spacing['2xl'], paddingHorizontal: formPadding }}>
        <View style={{ marginBottom: isWeb ? Spacing.md : Spacing.lg }}>
          <SegmentedControl
            tintColor={Colors.whiteColor}
            style={{
              height: isWeb ? 44 : 52,
              borderRadius: isWeb ? BorderRadius.md : BorderRadius.md,
              elevation: isWeb ? 0 : 4,
              boxShadow: isWeb ? '0 2px 8px rgba(0,0,0,0.08)' : undefined,
              backgroundColor: Colors.primary[500],
              ...Shadows.shadow.sm,
            }}
            backgroundColor={Colors.primary[500]}
            fontStyle={{
              fontFamily: Typography.fontFamily.medium,
              color: Colors.whiteColor,
              fontSize: isWeb ? Typography.fontSize.sm : Typography.fontSize.md
            }}
            onValueChange={(v) => { }}
            tabStyle={{
              height: isWeb ? 44 : 52,
              borderRadius: isWeb ? BorderRadius.sm : BorderRadius.sm,
            }}
            appearance='light'
            activeFontStyle={{
              fontFamily: Typography.fontFamily.medium,
              color: Colors.primary[500],
              fontSize: isWeb ? Typography.fontSize.sm : Typography.fontSize.md
            }}
            values={[...Array.from(tabs).map(t => t['name'])]}
            selectedIndex={step}
            onChange={(event) => {
              const { nativeEvent } = event;
              const { selectedSegmentIndex } = nativeEvent;
              setstep(selectedSegmentIndex)
            }}
            activeStyle={{ borderRadius: isWeb ? BorderRadius.sm : BorderRadius.sm, backgroundColor: Colors.whiteColor }}
          />
        </View>
      </View>

      <View style={{ width: "100%", flex: 1, paddingTop: isWeb ? Spacing.md : Spacing.xl }}>
        {/* Step 0: Nouveau membre form */}
        {step === 0 && (
          <Formik
            key={788775}
            initialValues={{
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
              idvillage: undefined,
              culturesPhares: [],
              etatCivil: '',
              nombreEnfants: '',
              typeAgriculture: [],
            }}
            validationSchema={memberSchemas}
            onSubmit={__handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
              return (
                <>
                  <KeyboardAvoidingView
                    behavior={isWeb ? 'padding' : Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1, width: '100%' }}
                    keyboardVerticalOffset={isWeb ? 0 : Platform.OS === 'ios' ? 0 : 100}
                    enabled
                  >
                    <ScrollView
                      contentContainerStyle={scrollContentStyle}
                      showsVerticalScrollIndicator={!isWeb}
                      keyboardShouldPersistTaps="handled"
                      keyboardDismissMode={isWeb ? 'none' : 'on-drag'}
                      refreshControl={<RefreshControl
                        colors={[Colors.primary[500]]}
                        refreshing={isloading}
                        onRefresh={() => { }}
                      />}
                    >
                      <View style={{ width: formMaxWidth, alignSelf: 'center', marginTop: isWeb ? Spacing.md : Spacing.lg, flex: 1, minWidth: 0 }}>

                        {/* Section: Informations personnelles */}
                        <View style={section}>
                          <Text style={[sectionTitle, { fontSize: titleFontSize }]}>Informations personnelles</Text>
                          <Text style={sectionSubtitle}>Remplissez les champs obligatoires marqués d'un *</Text>

                          <ResponsiveFieldRow>
                            <FieldRowItem>
                              <View style={fieldGroup}>
                                <Text style={[inputLabel, { fontSize: labelFontSize }]}>Nom <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                                <TextInput
                                  value={values.nom}
                                  placeholder='Nom'
                                  maxLength={50}
                                  keyboardType={"default"}
                                  autoCapitalize="words"
                                  onChangeText={(t) => handleChange('nom')(`${t}`)}
                                  style={[input, { fontFamily: Typography.fontFamily.regular, width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                                />
                              </View>
                              {errors.nom && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.nom}</Text>}
                            </FieldRowItem>

                            <FieldRowItem>
                              <View style={fieldGroup}>
                                <Text style={[inputLabel, { fontSize: labelFontSize }]}>Postnom <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                                <TextInput
                                  value={values.postnom}
                                  placeholder='Postnom'
                                  maxLength={50}
                                  keyboardType={"default"}
                                  autoCapitalize="words"
                                  onChangeText={(t) => handleChange('postnom')(`${t}`)}
                                  style={[input, { fontFamily: Typography.fontFamily.regular, width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                                />
                              </View>
                              {errors.postnom && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.postnom}</Text>}
                            </FieldRowItem>
                          </ResponsiveFieldRow>

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Prénom</Text>
                            <TextInput
                              value={values.prenom}
                              placeholder='Prénom'
                              maxLength={50}
                              keyboardType={"default"}
                              autoCapitalize="words"
                              onChangeText={(t) => handleChange('prenom')(`${t}`)}
                              style={[input, { fontFamily: Typography.fontFamily.regular, width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                            />
                          </View>
                          {errors.prenom && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.prenom}</Text>}
                        </View>

                        {/* Section: Contact */}
                        <View style={section}>
                          <Text style={[sectionTitle, { fontSize: titleFontSize }]}>Contact</Text>

                          <ResponsiveFieldRow>
                            <FieldRowItem>
                              <View style={fieldGroup}>
                                <Text style={[inputLabel, { fontSize: labelFontSize }]}>Téléphone <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                                <TextInput
                                  value={values.phone}
                                  placeholder='+243 81 23 45 67'
                                  maxLength={50}
                                  keyboardType={"number-pad"}
                                  onChangeText={(t) => handleChange('phone')(`${t}`)}
                                  style={[input, { fontFamily: Typography.fontFamily.regular, width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                                />
                              </View>
                              {errors.phone && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.phone}</Text>}
                            </FieldRowItem>

                            <FieldRowItem>
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
                                  style={[input, { fontFamily: Typography.fontFamily.regular, width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                                />
                              </View>
                              {errors.email && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.email}</Text>}
                            </FieldRowItem>
                          </ResponsiveFieldRow>
                        </View>

                        {/* Section: Détails agricoles */}
                        <View style={section}>
                          <Text style={[sectionTitle, { fontSize: titleFontSize }]}>Détails agricoles</Text>

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Hectare cultivé</Text>
                            <TextInput
                              value={values.hectare_cultive}
                              placeholder='1.5'
                              maxLength={50}
                              keyboardType={"numeric"}
                              onChangeText={(t) => handleChange('hectare_cultive')(`${t}`)}
                              style={[input, { fontFamily: Typography.fontFamily.regular, width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                            />
                          </View>
                          {errors.hectare_cultive && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.hectare_cultive}</Text>}

                          <View style={[fieldGroup, { marginTop: Spacing.md }]}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Cultures phares cultivées <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.xs }}>
                              {STAPLE_CROPS.map((crop, index) => (
                                <TouchableOpacity
                                  key={crop}
                                  onPress={() => {
                                    const currentCrops = values.culturesPhares || [];
                                    const isSelected = currentCrops.includes(crop);
                                    const newCrops = isSelected
                                      ? currentCrops.filter(c => c !== crop)
                                      : [...currentCrops, crop];
                                    handleChange('culturesPhares')(newCrops);
                                  }}
                                  style={{
                                    paddingHorizontal: Spacing.md,
                                    paddingVertical: Spacing.sm,
                                    borderRadius: BorderRadius.full,
                                    backgroundColor: (values.culturesPhares || []).includes(crop) ? Colors.primary[500] : Colors.surface.primary,
                                    borderWidth: 1,
                                    borderColor: (values.culturesPhares || []).includes(crop) ? Colors.primary[500] : Colors.border.main,
                                    ...Shadows.shadow.xs,
                                  }}
                                >
                                  <Text style={{
                                    fontFamily: Typography.fontFamily.medium,
                                    fontSize: inputFontSize,
                                    color: (values.culturesPhares || []).includes(crop) ? Colors.whiteColor : Colors.text.primary,
                                  }}>
                                    {crop}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                              <TouchableOpacity
                                onPress={() => setShowCustomCropInput(true)}
                                style={{
                                  paddingHorizontal: Spacing.md,
                                  paddingVertical: Spacing.sm,
                                  borderRadius: BorderRadius.full,
                                  backgroundColor: Colors.surface.primary,
                                  borderWidth: 1,
                                  borderColor: Colors.border.main,
                                  borderStyle: 'dashed',
                                  ...Shadows.shadow.xs,
                                }}
                              >
                                <Text style={{
                                  fontFamily: Typography.fontFamily.medium,
                                  fontSize: inputFontSize,
                                  color: Colors.text.tertiary,
                                }}>
                                  + Autre
                                </Text>
                              </TouchableOpacity>
                            </View>
                            {(values.culturesPhares || []).length === 0 && !showCustomCropInput && (
                              <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>Sélectionner au moins une culture</Text>
                            )}
                            {showCustomCropInput && (
                              <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm, flexWrap: 'wrap' }}>
                                <TextInput
                                  value={customCropValue}
                                  onChangeText={setCustomCropValue}
                                  placeholder='Nom de la culture'
                                  style={{
                                    flex: 1,
                                    minWidth: isMobile ? '100%' : 200,
                                    height: inputHeight,
                                    ...input,
                                    fontFamily: Typography.fontFamily.regular,
                                    fontSize: inputFontSize,
                                  }}
                                  autoCapitalize="words"
                                  maxLength={50}
                                />
                                <TouchableOpacity
                                  onPress={() => {
                                    if (customCropValue.trim()) {
                                      const currentCrops = values.culturesPhares || [];
                                      if (!currentCrops.includes(customCropValue.trim())) {
                                        handleChange('culturesPhares')([...currentCrops, customCropValue.trim()]);
                                      }
                                      setCustomCropValue('');
                                      setShowCustomCropInput(false);
                                    }
                                  }}
                                  style={{
                                    height: inputHeight,
                                    paddingHorizontal: Spacing.md,
                                    borderRadius: BorderRadius.button,
                                    backgroundColor: Colors.primary[500],
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    ...Shadows.shadow.sm,
                                  }}
                                >
                                  <Text style={{ color: Colors.whiteColor, fontFamily: Typography.fontFamily.medium, fontSize: inputFontSize }}>
                                    Ajouter
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => { setCustomCropValue(''); setShowCustomCropInput(false); }}
                                  style={{
                                    height: inputHeight,
                                    paddingHorizontal: Spacing.md,
                                    borderRadius: BorderRadius.button,
                                    backgroundColor: Colors.neutral[300],
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Text style={{ color: Colors.text.secondary, fontFamily: Typography.fontFamily.medium, fontSize: inputFontSize }}>
                                    Annuler
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            )}
                            {errors.culturesPhares && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.culturesPhares}</Text>}
                          </View>
                        </View>

                        {/* Section: Type d'agriculture appliquée */}
                        <View style={section}>
                          <Text style={[sectionTitle, { fontSize: titleFontSize }]}>Type d'agriculture appliquée</Text>
                          <View style={[fieldGroup, { marginTop: Spacing.md }]}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Type(s) d'agriculture</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.xs }}>
                              {FARMING_TYPES.map((type, index) => (
                                <TouchableOpacity
                                  key={type.id}
                                  onPress={() => {
                                    const currentTypes = values.typeAgriculture || [];
                                    const isSelected = currentTypes.includes(type.id);
                                    const newTypes = isSelected
                                      ? currentTypes.filter(t => t !== type.id)
                                      : [...currentTypes, type.id];
                                    handleChange('typeAgriculture')(newTypes);
                                  }}
                                  style={{
                                    paddingHorizontal: Spacing.md,
                                    paddingVertical: Spacing.sm,
                                    borderRadius: BorderRadius.full,
                                    backgroundColor: (values.typeAgriculture || []).includes(type.id) ? Colors.primary[500] : Colors.surface.primary,
                                    borderWidth: 1,
                                    borderColor: (values.typeAgriculture || []).includes(type.id) ? Colors.primary[500] : Colors.border.main,
                                    ...Shadows.shadow.xs,
                                  }}
                                >
                                  <Text style={{
                                    fontFamily: Typography.fontFamily.medium,
                                    fontSize: inputFontSize,
                                    color: (values.typeAgriculture || []).includes(type.id) ? Colors.whiteColor : Colors.text.primary,
                                  }}>
                                    {type.label}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                            {errors.typeAgriculture && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.typeAgriculture}</Text>}
                          </View>
                        </View>

                        {/* Section: Sexe et Village */}
                        <View style={section}>
                          <Text style={[sectionTitle, { fontSize: titleFontSize }]}>Profil</Text>

                          <ResponsiveFieldRow>
                            <FieldRowItem>
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
                                            <Text style={{ ...dropdown.dropdownButtonTxtStyle, fontFamily: Typography.fontFamily.bold, color: Colors.primary[500], fontSize: inputFontSize }}>
                                              {(selectedItem && selectedItem.label) || 'Sélectionner le sexe'}
                                            </Text>
                                            <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="black" />
                                          </View>
                                        );
                                      }}
                                      renderItem={(item, index, isSelected) => {
                                        return (
                                          <View style={{ ...dropdown.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                            <Text style={{ ...dropdown.dropdownItemTxtStyle, fontFamily: Typography.fontFamily.medium, fontSize: inputFontSize }}>{item.label}</Text>
                                          </View>
                                        );
                                      }}
                                      showsVerticalScrollIndicator={false}
                                      dropdownStyle={dropdown.dropdownMenuStyle}
                                      defaultValue={values.genre}
                                    />
                                  </View>
                                </View>
                                {errors.genre && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.genre}</Text>}
                              </View>
                            </FieldRowItem>

                            <FieldRowItem>
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
                                            <Text style={{ ...dropdown.dropdownButtonTxtStyle, fontFamily: Typography.fontFamily.bold, color: Colors.primary[500], fontSize: inputFontSize }}>
                                              {(selectedItem && selectedItem.village) || 'Sélectionner un village'}
                                            </Text>
                                            <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="black" />
                                          </View>
                                        );
                                      }}
                                      renderItem={(item, index, isSelected) => {
                                        return (
                                          <View style={{ ...dropdown.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                            <Text style={{ ...dropdown.dropdownItemTxtStyle, fontFamily: Typography.fontFamily.medium, fontSize: inputFontSize }}>{item.village}</Text>
                                          </View>
                                        );
                                      }}
                                      defaultValue={values.idvillage}
                                      showsVerticalScrollIndicator={false}
                                      dropdownStyle={dropdown.dropdownMenuStyle}
                                    />
                                  </View>
                                </View>
                                {errors.idvillage && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.idvillage}</Text>}
                              </View>
                            </FieldRowItem>

                            <FieldRowItem>
                              <View style={fieldGroup}>
                                <Text style={[inputLabel, { fontSize: labelFontSize }]}>État civil</Text>
                                <View style={inputGroup.container}>
                                  <View style={[inputGroup.inputcontainer, { width: "100%" }]}>
                                    <SelectDropdown
                                      data={[...MARITAL_STATUSES]}
                                      onSelect={(selectedItem, index) => {
                                        const { id } = selectedItem
                                        handleChange('etatCivil')(`${id}`)
                                      }}
                                      renderButton={(selectedItem, isOpened) => {
                                        return (
                                          <View style={{ ...dropdown.dropdownButtonStyle, width: "100%", backgroundColor: Colors.whiteColor, height: inputHeight }}>
                                            <Text style={{ ...dropdown.dropdownButtonTxtStyle, fontFamily: Typography.fontFamily.bold, color: Colors.primary[500], fontSize: inputFontSize }}>
                                              {(selectedItem && selectedItem.label) || 'Sélectionner l\'état civil'}
                                            </Text>
                                            <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="black" />
                                          </View>
                                        );
                                      }}
                                      renderItem={(item, index, isSelected) => {
                                        return (
                                          <View style={{ ...dropdown.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                            <Text style={{ ...dropdown.dropdownItemTxtStyle, fontFamily: Typography.fontFamily.medium, fontSize: inputFontSize }}>{item.label}</Text>
                                          </View>
                                        );
                                      }}
                                      showsVerticalScrollIndicator={false}
                                      dropdownStyle={dropdown.dropdownMenuStyle}
                                      defaultValue={values.etatCivil}
                                    />
                                  </View>
                                </View>
                                {errors.etatCivil && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.etatCivil}</Text>}
                              </View>
                            </FieldRowItem>

                            <FieldRowItem>
                              <View style={fieldGroup}>
                                <Text style={[inputLabel, { fontSize: labelFontSize }]}>Nombre d'enfant</Text>
                                <TextInput
                                  value={values.nombreEnfants}
                                  placeholder='0'
                                  maxLength={3}
                                  keyboardType={"numeric"}
                                  onChangeText={(t) => handleChange('nombreEnfants')(`${t}`)}
                                  style={[input, { fontFamily: Typography.fontFamily.regular, width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                                />
                                {errors.nombreEnfants && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.nombreEnfants}</Text>}
                              </View>
                            </FieldRowItem>
                          </ResponsiveFieldRow>
                        </View>

                        {/* Section: Date de naissance */}
                        <View style={section}>
                          <Text style={[sectionTitle, { fontSize: titleFontSize }]}>Date de naissance <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                          <ResponsiveFieldRow>
                            <FieldRowItem>
                              <View style={fieldGroup}>
                                <Text style={[inputLabel, { fontSize: labelFontSize }]}>Jour</Text>
                                <TextInput
                                  placeholder='JJ'
                                  maxLength={2}
                                  keyboardType={"numeric"}
                                  onChangeText={(t) => handleChange('date_production_d')(`${t}`)}
                                  style={[input, { fontFamily: Typography.fontFamily.regular, width: "100%", height: inputHeight, fontSize: inputFontSize, textAlign: 'center' }]}
                                />
                              </View>
                              {errors.date_production_d && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.date_production_d}</Text>}
                            </FieldRowItem>
                            <FieldRowItem>
                              <View style={fieldGroup}>
                                <Text style={[inputLabel, { fontSize: labelFontSize }]}>Mois</Text>
                                <TextInput
                                  placeholder='MM'
                                  maxLength={2}
                                  keyboardType={"numeric"}
                                  onChangeText={(t) => handleChange('date_production_m')(`${t}`)}
                                  style={[input, { fontFamily: Typography.fontFamily.regular, width: "100%", height: inputHeight, fontSize: inputFontSize, textAlign: 'center' }]}
                                />
                              </View>
                              {errors.date_production_m && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.date_production_m}</Text>}
                            </FieldRowItem>
                            <FieldRowItem>
                              <View style={fieldGroup}>
                                <Text style={[inputLabel, { fontSize: labelFontSize }]}>Année</Text>
                                <TextInput
                                  placeholder={`AAAA`}
                                  maxLength={4}
                                  keyboardType={"numeric"}
                                  onChangeText={(t) => handleChange('date_production_y')(`${t}`)}
                                  style={[input, { fontFamily: Typography.fontFamily.regular, width: "100%", height: inputHeight, fontSize: inputFontSize, textAlign: 'center' }]}
                                />
                              </View>
                              {errors.date_production_y && <Text style={[inputErrorText, { fontSize: Typography.fontSize.xs, marginTop: Spacing.xs }]}>{errors.date_production_y}</Text>}
                            </FieldRowItem>
                          </ResponsiveFieldRow>
                        </View>

                        {/* Submit Button */}
                        <View style={{ width: "100%", marginTop: Spacing.xl, marginBottom: Spacing['2xl'] }}>
                          <TouchableHighlight
                            onPress={() => {
                              handleSubmit()
                            }}
                            disabled={isloading}
                            underlayColor={Colors.primary[600]}
                            style={[btnPrimaryLg, { width: "100%", height: buttonHeight }]}
                            activeOpacity={0.9}
                          >
                            {isloading
                              ?
                              <Loader />
                              :
                              <Text style={{ color: Colors.whiteColor, fontFamily: Typography.fontFamily.medium, fontSize: inputFontSize, fontWeight: '600' }}>Enregistrer</Text>
                          }
                          </TouchableHighlight>
                          {output && (
                            <Text style={{ fontFamily: Typography.fontFamily.regular, fontSize: Typography.fontSize.sm, marginTop: Spacing.md, color: Colors.danger.main, textAlign: "center" }}>
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

        {/* Step 1: Ancien utilisateur search */}
        {step === 1 && (
          <KeyboardAvoidingView
            behavior={isWeb ? 'padding' : Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, width: '100%' }}
            keyboardVerticalOffset={isWeb ? 0 : Platform.OS === 'ios' ? 0 : 100}
            enabled
          >
            <ScrollView
              contentContainerStyle={scrollContentStyle}
              showsVerticalScrollIndicator={!isWeb}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={isWeb ? 'none' : 'on-drag'}
              refreshControl={<RefreshControl
                colors={[Colors.primary[500]]}
                refreshing={isloading}
                onRefresh={__onLoad}
              />}
            >
              <View style={{ width: formMaxWidth, alignSelf: 'center', marginTop: isWeb ? Spacing.md : Spacing.lg, flex: 1, minWidth: 0 }}>
                <View style={section}>
                  <Text style={[sectionTitle, { fontSize: titleFontSize }]}>Rechercher un membre existant</Text>
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
                        paddingHorizontal: Spacing.md,
                        height: inputHeight,
                        borderRadius: BorderRadius.input,
                        fontFamily: Typography.fontFamily.bold,
                        width: "100%",
                        color: Colors.primary[500],
                        fontSize: inputFontSize
                      }}
                    />
                  </View>
                  <TouchableHighlight
                    underlayColor={Colors.primary[600]}
                    style={[btnPrimaryLg, { backgroundColor: Colors.primary[500], marginVertical: Spacing.md, elevation: 4, height: buttonHeight, ...Shadows.shadow.sm }]}
                    activeOpacity={0.9}
                  >
                    <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center", paddingVertical: Spacing.xs, height: "100%" }}>
                      <Ionicons name='search' color={Colors.whiteColor} size={22} />
                      <Text style={{ fontFamily: Typography.fontFamily.bold, color: Colors.whiteColor, paddingLeft: Spacing.sm, fontSize: inputFontSize, fontWeight: '600' }}>Chercher</Text>
                    </View>
                  </TouchableHighlight>
                  <View style={{ width: "100%", marginTop: Spacing.md }}>
                    <FlatList
                      contentContainerStyle={{ paddingBottom: Spacing.xl }}
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
    </View>
  )
}