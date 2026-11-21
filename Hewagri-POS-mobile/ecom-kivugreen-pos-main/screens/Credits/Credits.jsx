import * as React from 'react'
import { Title } from '../../components/Title/Title'
import { RefreshControl, ScrollView, Text, TextInput, TouchableHighlight, View, StyleSheet, Platform } from 'react-native';
import { Dims } from '../../assets/dimensions/Dimemensions';
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
} from '../../assets/styles/Styles';
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
import { useWindowDimensions } from 'react-native';

// Web-compatible DatePicker fallback
const WebDatePicker = ({ open, date, onConfirm, onCancel, ...props }) => {
  const [localDate, setLocalDate] = React.useState(date);

  React.useEffect(() => {
    if (open) {
      // For web, we'll use a simple input type="date" approach
      // The open prop is controlled by parent, so we don't need to do anything here
    }
  }, [open, date]);

  const handleChange = (e) => {
    const newDate = new Date(e.target.value);
    setLocalDate(newDate);
    onConfirm(newDate);
  };

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={styles.webDatePickerContainer}>
      <input
        type="date"
        value={localDate ? localDate.toISOString().split('T')[0] : ''}
        onChange={handleChange}
        onBlur={onCancel}
        style={styles.webDateInput}
      />
    </View>
  );
};

export const CreditsScreen = ({ route, navigation }) => {

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && width > 768;
  const isTablet = isWeb && width >= 768 && width < 1024;

  const formMaxWidth = isDesktop ? 680 : isTablet ? 600 : '100%';
  const formPadding = isDesktop ? 32 : isTablet ? 24 : 16;
  const inputHeight = ComponentTokens.input.height.md;
  const labelFontSize = 14;
  const inputFontSize = 14;

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
    motif: Yup.string().required('Entre le motif du crédit !'),
    montant: Yup.string().required('Entre le montant du crédit !'),
    currency: Yup.string().required("Entre la devise !"),
    periode_remboursement: Yup.string().required('Entrer la periode de remboursement !'),
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
            text: "Enregistrement effectué avec succès !",
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
    <View style={{ flex: 1, backgroundColor: Colors.background.primary }}>
      <Title navigation={navigation} title={"Demande de crédit"} subtitle={"Formulaire de demande de crédit"} />
      <View style={{ width: "100%", paddingTop: isWeb ? 16 : 40 }}>
        <View style={{ width: formMaxWidth, alignSelf: "center", paddingHorizontal: formPadding }}>
          <SegmentedControl
            tintColor={Colors.whiteColor}
            style={{
              height: isWeb ? 48 : 56,
              elevation: isWeb ? 0 : 4,
              boxShadow: isWeb ? '0 2px 8px rgba(0,0,0,0.08)' : undefined,
              borderRadius: isWeb ? 8 : BorderRadius.md,
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
              height: isWeb ? 48 : 56,
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
        <>
          {step === 0 && (
            <ScrollView
              contentContainerStyle={{ paddingBottom: 100, backgroundColor: Colors.background.primary, width: '100%' }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode='interactive'
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ width: formMaxWidth, alignSelf: 'center', paddingHorizontal: formPadding }}>
                {Object.keys(customer).length > 0 && (
                  <View style={[cardElevated, { marginTop: 16, marginBottom: 20, padding: Spacing.lg }]}>
                    <View style={flexRowBetween}>
                      <View style={flexRow}>
                        <View style={{
                          width: 44,
                          height: 44,
                          borderRadius: BorderRadius.full,
                          backgroundColor: `${Colors.primary[500]}15`,
                          ...flexRowCenter,
                          marginRight: Spacing.md,
                        }}>
                          <Ionicons name="person-outline" size={22} color={Colors.primary[500]} />
                        </View>
                        <View>
                          <Text style={{ fontFamily: "mons-e", fontSize: 12, color: Colors.text.tertiary }}>Membre sélectionné</Text>
                          <Text style={{ fontFamily: "mons-b", fontSize: 16, color: Colors.text.primary }}>
                            {customer && customer['nom'] ? String(customer['nom']).concat(" ").concat(customer['postnom']) : ""}
                          </Text>
                        </View>
                      </View>
                      <View style={flexRowCenter}>
                        <Ionicons name="card-outline" size={20} color={Colors.primary[500]} style={{ marginRight: 8 }} />
                        <Text style={{ fontFamily: "mons-e", fontSize: 12, color: Colors.text.tertiary }}>Carte N°</Text>
                        <Text style={{ fontFamily: "mons-b", fontSize: 14, color: Colors.primary[500] }}>
                          {customer && customer['__tbl_ecom_hasmember'] ? customer['__tbl_ecom_hasmember']['id'] : ""}
                        </Text>
                      </View>
                    </View>
                    <Divider style={{ marginVertical: Spacing.md }} />
                    <View style={flexRowBetween}>
                      <View>
                        <Text style={{ fontFamily: "mons-e", fontSize: 12, color: Colors.text.tertiary }}>Contact</Text>
                        <Text style={{ fontFamily: "mons-b", fontSize: 14, color: Colors.text.primary }}>
                          {customer && customer['phone'] ? String(customer['phone']) : ""}
                        </Text>
                      </View>
                      <TouchableHighlight
                        underlayColor={Colors.neutral[200]}
                        onPress={() => { setcustomer({}); setrescann(true); }}
                        style={{
                          paddingHorizontal: Spacing.md,
                          paddingVertical: Spacing.xs,
                          backgroundColor: Colors.danger.main + '15',
                          borderRadius: BorderRadius.sm,
                          borderWidth: 1,
                          borderColor: Colors.danger.main + '40',
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={{ fontFamily: "mons-b", fontSize: 12, color: Colors.danger.main }}>Changer</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                )}

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
                  }}
                  validationSchema={creditSchema}
                  onSubmit={values => __handleSubmit({ values })}
                >
                  {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
                    return (
                      <>
                        <View style={section}>
                          <Text style={sectionTitle}>Détails du crédit</Text>
                          <Text style={sectionSubtitle}>Remplissez tous les champs obligatoires</Text>

                          {customer && Object.keys(customer).length > 0 && (
                            <View style={fieldGroup}>
                              <Text style={[inputLabel, { fontSize: labelFontSize }]}>Membre <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                              <View style={{ backgroundColor: Colors.neutral[50], borderRadius: BorderRadius.input, borderWidth: 1, borderColor: Colors.border.main }}>
                                <TextInput
                                  editable={false}
                                  value={String("**********").concat(values.id_member)}
                                  placeholder='ID Membre'
                                  maxLength={50}
                                  keyboardType={"numeric"}
                                  onChangeText={(t) => handleChange('id_member')(`${t}`)}
                                  style={[input, { fontFamily: "mons", width: "100%", height: inputHeight, fontSize: inputFontSize, backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 16 }]}
                                />
                              </View>
                            </View>
                          )}

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Montant du crédit <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                              <View style={{ width: isWeb ? 120 : '35%', maxWidth: 120 }}>
                                <SelectDropdown
                                  data={[{ id: "CDF" }, { id: "USD" }]}
                                  onSelect={(selectedItem, index) => {
                                    const { id } = selectedItem
                                    handleChange('currency')(`${id}`)
                                  }}
                                  renderButton={(selectedItem, isOpened) => {
                                    return (
                                      <View style={{
                                        width: "100%",
                                        height: inputHeight,
                                        backgroundColor: Colors.surface.primary,
                                        borderWidth: 1,
                                        borderColor: Colors.border.main,
                                        borderRadius: BorderRadius.input,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingHorizontal: Spacing.md,
                                      }}>
                                        <Text style={{
                                          fontFamily: "mons-b",
                                          color: Colors.primary[500],
                                          fontSize: inputFontSize,
                                        }}>
                                          {(selectedItem && selectedItem.id) || 'Devise'}
                                        </Text>
                                        <Entypo name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="black" />
                                      </View>
                                    );
                                  }}
                                  renderItem={(item, index, isSelected) => {
                                    return (
                                      <View style={{ paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                        <Text style={{ fontFamily: "mons-e", fontSize: inputFontSize }}>{item.id}</Text>
                                      </View>
                                    );
                                  }}
                                  showsVerticalScrollIndicator={false}
                                  dropdownStyle={{
                                    backgroundColor: Colors.surface.primary,
                                    borderRadius: BorderRadius.md,
                                    borderWidth: 1,
                                    borderColor: Colors.border.main,
                                    ...Shadows.shadow.md,
                                  }}
                                />
                              </View>
                              <View style={{ flex: 1 }}>
                                <TextInput
                                  placeholder='1000'
                                  maxLength={50}
                                  keyboardType={"numeric"}
                                  onChangeText={(t) => handleChange('montant')(`${t}`)}
                                  style={[input, { fontFamily: "mons", width: "100%", height: inputHeight, fontSize: inputFontSize }]}
                                />
                              </View>
                            </View>
                          </View>
                          {(errors.montant || errors.currency) && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.montant || errors.currency}</Text>}

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Motif du crédit <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                            <TextInput
                              multiline
                              numberOfLines={3}
                              placeholder='Motif du crédit'
                              maxLength={200}
                              keyboardType={"default"}
                              onChangeText={(t) => handleChange('motif')(`${t}`)}
                              style={[input, { fontFamily: "mons", width: "100%", height: 100, fontSize: inputFontSize, textAlignVertical: 'top', paddingTop: 12 }]}
                            />
                          </View>
                          {errors.motif && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.motif}</Text>}

                          {/* Native DatePicker (mobile) */}
                          {Platform.OS !== 'web' && (
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
                          )}

                          {/* Web DatePicker fallback */}
                          <WebDatePicker
                            open={open}
                            date={date}
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

                          <View style={fieldGroup}>
                            <Text style={[inputLabel, { fontSize: labelFontSize }]}>Période de remboursement <Text style={{ color: Colors.danger.main }}>*</Text></Text>
                            <TouchableHighlight
                              underlayColor={Colors.neutral[200]}
                              style={{
                                width: '100%',
                                backgroundColor: Colors.surface.primary,
                                borderWidth: 1,
                                borderColor: Colors.border.main,
                                borderRadius: BorderRadius.input,
                                paddingHorizontal: Spacing.md,
                                paddingVertical: Spacing.md,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                minHeight: inputHeight,
                              }}
                              onPress={() => { setOpen(!open) }}
                              activeOpacity={0.8}
                            >
                              <View style={flexRowCenter}>
                                <Text style={{ fontFamily: "mons", color: Colors.primary[500], fontSize: inputFontSize }}>
                                  {values.periode_remboursement ? String(values.periode_remboursement).concat(" Mois") : "Sélectionner une période"}
                                </Text>
                                <Ionicons name="calendar-outline" size={22} color={Colors.text.tertiary} style={{ marginLeft: Spacing.md }} />
                              </View>
                            </TouchableHighlight>
                          </View>
                          {errors.periode_remboursement && <Text style={[inputErrorText, { fontSize: 12, marginTop: Spacing.xs }]}>{errors.periode_remboursement}</Text>}
                        </View>

                        <View style={{ width: "100%", marginTop: 24, marginBottom: 40 }}>
                          <TouchableHighlight
                            onPress={handleSubmit}
                            disabled={isloading}
                            underlayColor={Colors.primary[600]}
                            style={[btnPrimaryLg, { width: "100%", height: inputHeight, ...Shadows.shadow.sm }]}
                            activeOpacity={0.9}
                          >
                            {isloading ? (
                              <Text style={{ color: Colors.whiteColor, fontFamily: "mons", fontSize: inputFontSize, fontWeight: '600' }}>Enregistrement...</Text>
                            ) : (
                              <Text style={{ color: Colors.whiteColor, fontFamily: "mons", fontSize: inputFontSize, fontWeight: '600' }}>Confirmer</Text>
                            )}
                          </TouchableHighlight>
                          {output && (
                            <Text style={{ fontFamily: "mons", fontSize: 13, marginTop: 10, color: Colors.danger.main, textAlign: "center" }}>
                              {output}
                            </Text>
                          )}
                        </View>
                      </>
                    )
                  }}
                </Formik>
              </View>
            </ScrollView>
          )}

          {step === 1 && (
            <View style={flexColCenter}>
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
                                      color: Colors.primary[500],
                                    },
                                    callback: () => {
                                      setrescann(true)
                                    }
                                  },
                                  cancel: {
                                    text: "Annuler",
                                    style: {
                                      fontFamily: "mons-e",
                                      color: Colors.primary[500]
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
                                    color: Colors.primary[500],
                                  },
                                  callback: () => {
                                    setrescann(true)
                                  }
                                },
                                cancel: {
                                  text: "Annuler",
                                  style: {
                                    fontFamily: "mons-e",
                                    color: Colors.primary[500]
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
                                color: Colors.primary[500],
                              },
                              callback: () => {
                                setrescann(true)
                              }
                            },
                            cancel: {
                              text: "Annuler",
                              style: {
                                fontFamily: "mons-e",
                                color: Colors.primary[500]
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
                              color: Colors.primary[500],
                            },
                            callback: () => {
                              setrescann(true)
                            }
                          },
                          cancel: {
                            text: "Annuler",
                            style: {
                              fontFamily: "mons-e",
                              color: Colors.primary[500]
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
                            color: Colors.primary[500],
                          },
                          callback: () => {
                            setrescann(true)
                          }
                        },
                        cancel: {
                          text: "Annuler",
                          style: {
                            fontFamily: "mons-e",
                            color: Colors.primary[500]
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
                          color: Colors.primary[500],
                        },
                        callback: () => {
                          setrescann(true)
                        }
                      },
                      cancel: {
                        text: "Annuler",
                        style: {
                          fontFamily: "mons-e",
                          color: Colors.primary[500]
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
        <DialogBox ref={ref} isOverlayClickClose={false} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  webDatePickerContainer: {
    width: '100%',
    marginTop: Spacing.md,
  },
  webDateInput: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface.primary,
    borderWidth: 1,
    borderColor: Colors.border.main,
    borderRadius: BorderRadius.input,
    fontSize: 14,
    fontFamily: "mons",
    color: Colors.text.primary,
  },
});

export default CreditsScreen;