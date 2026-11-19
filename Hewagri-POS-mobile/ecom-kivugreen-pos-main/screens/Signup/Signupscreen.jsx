import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, ScrollView, Keyboard } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Header } from '../../components/Header/comp.header';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { btn, inputGroup } from '../../assets/styles/Styles';
import { Divider } from 'react-native-paper';
import { onRunExternalRQST } from '../../services/communications';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import { Title } from '../../components/Title/Title';

export const SignupScreen = ({ navigation, route }) => {

    const [isloading, setisloading] = React.useState(false);
    const [isFocus, setIsFocus] = React.useState(false);
    const [isFocusg, setIsFocusg] = React.useState(false);
    const [hosp, sethosp] = React.useState({});
    const [gender, setgender] = React.useState("");
    const [genders, setgeders] = React.useState([]);
    const [hosps, sethops] = React.useState([]);
    const [temp, settemp] = React.useState([]);

    const onSubmit = () => {
        Toast.show({
            type: 'info',
            text1: 'Démande de permis',
            text2: 'La demande de permis n\'est pas disponible pour le moment !',
        });
    };

    React.useEffect(() => {
        setgeders(
            [
                { id: "Masculin", value: "Masculin" },
                { id: "Feminin", value: "Feminin" }
            ]
        )
    }, [])

    return (
        <>
            <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
                <Title navigation={navigation} title={"Demande de permis"} subtitle={"Formulaire de démande de permis"} />
                <ScrollView
                    contentContainerStyle={{ paddingBottom: "auto", backgroundColor: Colors.primaryColor }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor, marginTop: Dims.smallradius, paddingBottom: 100 }}>
                        <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 0 }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Nom <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                <View style={inputGroup.container}>
                                    <View style={inputGroup.inputcontainer}>
                                        <TextInput placeholder='Nom' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <FontAwesome name="user" size={Dims.iconsize} color={Colors.whiteColor} />
                                    </View>
                                </View>
                            </View>
                            {/* ------------------------ */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Postnom <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                <View style={inputGroup.container}>
                                    <View style={inputGroup.inputcontainer}>
                                        <TextInput placeholder='Postnom' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <FontAwesome name="user" size={Dims.iconsize} color={Colors.whiteColor} />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Prenom </Text>
                                <View style={inputGroup.container}>
                                    <View style={inputGroup.inputcontainer}>
                                        <TextInput placeholder='Prenom ...' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <FontAwesome name="user" size={Dims.iconsize} color={Colors.whiteColor} />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Numéro de téléphone <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                <View style={inputGroup.container}>
                                    <View style={inputGroup.inputcontainer}>
                                        <TextInput placeholder='Numéro de téléphone' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <Entypo name="phone" size={Dims.iconsize} color={Colors.whiteColor} />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Genre <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                <View style={inputGroup.container}>
                                    <View style={inputGroup.inputcontainer}>
                                        {/* <TextInput style={{ backgroundColor: Colors.pillColor,fontFamily: "mons",  height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} /> */}
                                        <Dropdown
                                            style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                            placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                            containerStyle={{}}
                                            selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                            inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                            // iconStyle={styles.iconStyle}
                                            data={genders}
                                            // search
                                            maxHeight={200}
                                            labelField="value"
                                            valueField="id"
                                            placeholder={!isFocusg ? 'Séléctionner le genre' : '...'}
                                            searchPlaceholder="Recherche ..."
                                            value={gender}
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            onChange={item => {
                                                setgender(item.value);
                                                setIsFocusg(false);
                                            }}
                                        />
                                    </View>
                                    <View style={[inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        {/* <Entypo name="phone" size={ Dims.iconsize } color={ Colors.whiteColor } /> */}
                                        <MaterialCommunityIcons name="gender-male-female" size={Dims.iconsize} color={Colors.whiteColor} />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Age <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                <View style={inputGroup.container}>
                                    <View style={inputGroup.inputcontainer}>
                                        <TextInput placeholder="Tappe l'âge ici " style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <MaterialIcons name="verified-user" size={Dims.iconsize} color={Colors.whiteColor} />
                                        {/* <Entypo name="phone" size={ Dims.iconsize } color={ Colors.whiteColor } /> */}
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            {/* <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Hôpital de reférence </Text>
                                <View style={inputGroup.container}>
                                    <View style={inputGroup.inputcontainer}>
                                        <Dropdown
                                            style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%" }]}
                                            placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                            containerStyle={{}}
                                            selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                            inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                            data={hosps}
                                            search
                                            maxHeight={200}
                                            labelField="name"
                                            valueField="id"
                                            placeholder={!isFocus ? 'Séléctionner un établissement' : '...'}
                                            searchPlaceholder="Recherche ..."
                                            value={hosp}
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            onChange={item => {
                                                // alert(item.value)
                                                sethosp(item.name);
                                                setIsFocus(false);
                                            }}
                                        />
                                    </View>
                                    <View style={[inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <FontAwesome5 name="hospital-symbol" size={Dims.iconsize} color={Colors.whiteColor} />
                                    </View>
                                </View>
                            </View> */}
                            {/* -------------------------- */}
                            <Divider style={{ marginTop: 25 }} />
                            {/* <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 10 }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Mot de passe <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                <View style={inputGroup.container}>
                                    <View style={inputGroup.inputcontainer}>
                                        <TextInput placeholder='Crée un mot de passe ici ' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <Entypo name="lock" size={Dims.iconsize} color={Colors.whiteColor} />
                                    </View>
                                </View>
                            </View> */}
                            {/* ------------------------ */}
                            {/* <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Confirmation mot de passe <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                <View style={inputGroup.container}>
                                    <View style={inputGroup.inputcontainer}>
                                        <TextInput placeholder='confirme le mot de passe ici ' style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                        <Entypo name="lock" size={Dims.iconsize} color={Colors.whiteColor} />
                                    </View>
                                </View>
                            </View> */}
                            {/* -------------------------- */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                <TouchableHighlight
                                    underlayColor={Colors.primaryColor}
                                    onPress={onSubmit}
                                    style={[btn, {}]}
                                >
                                    <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Confirmer la démande de permis</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                    <Footer />
                </ScrollView>
            </View>
        </>
    )
}