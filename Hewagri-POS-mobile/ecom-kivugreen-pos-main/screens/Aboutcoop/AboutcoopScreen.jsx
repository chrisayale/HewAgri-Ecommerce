import * as React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { appname } from '../../assets/configs/configs';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { Divider } from 'react-native-elements';

export const AboutcoopScreen = ({ navigation }) => {
    const { sigle, cooperative, logo, isformel, email, phone, num_enregistrement, adresse, description, coordonnees_gps, __tbl_ecom_province, __tbl_ecom_territoire, __tbl_ecom_users } = global.coopec || {}
    React.useEffect(() => {
        // console.log('====================================');
        // console.log(global.coopec);
        // console.log('====================================');
    }, [])
    return (
        <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
            <Title
                title={`A propos de ${cooperative}`}
                subtitle={`Ce qu'il faut savoir sur ${cooperative}`}
                navigation={navigation}
                // action={() => {
                //     navigation.navigate()
                // }}
            />
            <View style={{ padding: 20, alignSelf: "center" }}>
                <Text style={{ fontFamily: "mons-b", fontSize: Dims.bigtitletextsize, textAlign: "center" }}>A propos de {cooperative}</Text>
                <Divider />
                <View style={{ paddingVertical: 10, paddingHorizontal: 1 }}>
                    <View style={{ paddingTop: 10 }}>
                        <Text style={{ fontFamily: "mons-e" }} >Coopérative</Text>
                        <Text style={{ fontFamily: "mons" }} >{cooperative}</Text>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        <Text style={{ fontFamily: "mons-e" }} >Sigle</Text>
                        <Text style={{ fontFamily: "mons" }} >{sigle}</Text>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        <Text style={{ fontFamily: "mons-e" }} >Adresse</Text>
                        <Text style={{ fontFamily: "mons" }} >{adresse}</Text>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        <Text style={{ fontFamily: "mons-e" }} >Email</Text>
                        <Text style={{ fontFamily: "mons" }} >{email}</Text>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        <Text style={{ fontFamily: "mons-e" }} >Téléphone</Text>
                        <Text style={{ fontFamily: "mons" }} >{phone}</Text>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        <Text style={{ fontFamily: "mons-e" }} >Nombre des membres</Text>
                        <Text style={{ fontFamily: "mons" }} >{__tbl_ecom_users.length} Membre ( s )</Text>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        <Text style={{ fontFamily: "mons-e" }} >Numero de contact</Text>
                        <Text style={{ fontFamily: "mons" }} >{phone}</Text>
                    </View>
                </View>
            </View>
            <Footer />
        </View>
    )
}