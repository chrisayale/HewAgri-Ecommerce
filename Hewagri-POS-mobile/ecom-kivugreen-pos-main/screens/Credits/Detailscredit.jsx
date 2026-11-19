import React from 'react'
import { Title } from '../../components/Title/Title'
import { calcYearFromMoonth, formatDate, returnStatus, trucString } from '../../assets/helper/helper.all'
import { Text, View } from 'react-native'
import { Colors } from '../../assets/colors/Colors'
import { Dims } from '../../assets/dimensions/Dimemensions'
import { Divider } from 'react-native-elements'
import { ScrollView } from 'react-native'

export const DetailsCreditScreen = ({ navigation, route }) => {

    const { params } = route
    const { item } = params

    const { createdat, montant, currency, motif, periode_remboursement, __tbl_ecom_cooperative = {}, __tbl_ecom_user = {}, __tbl_ecom_bank = {}, status } = item
    const { logo, adresse, phone, email, num_enregistrement, sigle, cooperative } = __tbl_ecom_cooperative || {}
    const { nom, avatar, postnom, prenom, phone: as_user_phone, email: as_email_user, date_naiss, sexe, id } = __tbl_ecom_user || {}
    const { bank, email: as_email_bank, phone: as_phone_bank } = __tbl_ecom_bank || {}

    return (
        <>
            <Title
                navigation={navigation}
                subtitle={"Détails démande de crédit"}
                title={"Détails démande de crédit"}
            />
            <ScrollView
                contentContainerStyle={{ paddingBottom: "100%", paddingTop: 0 }}
            >
                <View style={{ width: "95%", alignSelf: "center", marginTop: 20, backgroundColor: Colors.pInRGBA, padding: 20 }}>
                    <>
                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.titletextsize }}>Informations sur la démande</Text>
                    </>
                    <>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontFamily: "mons-e" }}>Montant</Text>
                            <View>
                                <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{montant} {currency}</Text>
                            </View>
                        </View>
                    </>
                    <Divider style={{ marginVertical: 10 }} />
                    <>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontFamily: "mons-e" }}>Motif de la démande</Text>
                            <View>
                                <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{trucString({ longueurMax: 30, nomItem: motif })}</Text>
                            </View>
                        </View>
                    </>
                    <Divider style={{ marginVertical: 10 }} />
                    <>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontFamily: "mons-e" }}>Période de rembourssement ( {periode_remboursement} mois )</Text>
                            <View>
                                <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{calcYearFromMoonth({ moonths: periode_remboursement })}</Text>
                            </View>
                        </View>
                    </>
                    <Divider style={{ marginVertical: 10 }} />
                    <>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontFamily: "mons-e" }}>Etat de la démande</Text>
                            <View>
                                <Text style={{ color: status ? Colors.primaryColor : Colors.darkColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{returnStatus({ status })}</Text>
                            </View>
                        </View>
                    </>
                    <Divider style={{ marginVertical: 10 }} />
                    <>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontFamily: "mons-e" }}>Date de création</Text>
                            <View>
                                <Text style={{ color: status ? Colors.primaryColor : Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{formatDate({ date: createdat })}</Text>
                            </View>
                        </View>
                    </>
                </View>

                {__tbl_ecom_user !== null && (
                    <View style={{ width: "95%", alignSelf: "center", marginTop: 20, backgroundColor: Colors.pInRGBA, padding: 20 }}>
                        <>
                            <Text style={{ fontFamily: "mons-b", fontSize: Dims.titletextsize }}>Informations sur le demandeur ( membre )</Text>
                        </>
                        <>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-e" }}>Nom</Text>
                                <View>
                                    <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{nom}</Text>
                                </View>
                            </View>
                        </>
                        <Divider style={{ marginVertical: 10 }} />
                        <>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-e" }}>Postnom</Text>
                                <View>
                                    <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{postnom}</Text>
                                </View>
                            </View>
                        </>
                        <Divider style={{ marginVertical: 10 }} />
                        <>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-e" }}>Prenom</Text>
                                <View>
                                    <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{prenom}</Text>
                                </View>
                            </View>
                        </>
                        <Divider style={{ marginVertical: 10 }} />
                        <>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-e" }}>Date de naissance</Text>
                                <View>
                                    <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{date_naiss}</Text>
                                </View>
                            </View>
                        </>
                        <Divider style={{ marginVertical: 10 }} />
                        <>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-e" }}>Sexe</Text>
                                <View>
                                    <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{sexe}</Text>
                                </View>
                            </View>
                        </>
                        <Divider style={{ marginVertical: 10 }} />
                        <>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-e" }}>Numéro de téléphone</Text>
                                <View>
                                    <Text style={{ color: status ? Colors.primaryColor : Colors.darkColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{as_user_phone}</Text>
                                </View>
                            </View>
                        </>
                        <Divider style={{ marginVertical: 10 }} />
                        <>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-e" }}>Adresse mail</Text>
                                <View>
                                    <Text style={{ color: status ? Colors.primaryColor : Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{as_email_user}</Text>
                                </View>
                            </View>
                        </>
                    </View>
                )}

                {__tbl_ecom_bank !== null && (
                    <View style={{ width: "95%", alignSelf: "center", marginTop: 20, backgroundColor: Colors.pInRGBA, padding: 20 }}>
                        <>
                            <Text style={{ fontFamily: "mons-b", fontSize: Dims.titletextsize }}>Informations sur la banque qui a approuvé</Text>
                        </>
                        <>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-e" }}>Nom</Text>
                                <View>
                                    <Text style={{ color: Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{bank}</Text>
                                </View>
                            </View>
                        </>
                        <Divider style={{ marginVertical: 10 }} />
                        <>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-e" }}>Numéro de téléphone</Text>
                                <View>
                                    <Text style={{ color: status ? Colors.primaryColor : Colors.darkColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{as_phone_bank}</Text>
                                </View>
                            </View>
                        </>
                        <Divider style={{ marginVertical: 10 }} />
                        <>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-e" }}>Adresse mail</Text>
                                <View>
                                    <Text style={{ color: status ? Colors.primaryColor : Colors.primaryColor, fontFamily: "mons", fontSize: Dims.titletextsize }}>{as_email_bank}</Text>
                                </View>
                            </View>
                        </>
                    </View>
                )}
            </ScrollView>
        </>
    )
}