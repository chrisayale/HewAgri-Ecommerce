import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { View, Text, TouchableHighlight, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { AntDesign, Entypo, Ionicons, Feather, MaterialIcons, Fontisto, FontAwesome, FontAwesome5, MaterialCommunityIcons, Zocial, Octicons } from '@expo/vector-icons';
import { Dims } from '../../assets/dimensions/Dimemensions';
import DialogBox from 'react-native-dialogbox';
import Toast from 'react-native-toast-message';
import { onDeconnextion } from '../../services/communications';
import * as Updates from 'expo-updates';
import * as Linking from 'expo-linking';
import { appname } from '../../assets/configs/configs';
import { emailValidator, returnInitialOfNames } from '../../assets/helper/helper.all';
import { Footer } from '../../components/Footer/comp.footer';
import RNRestart from 'react-native-restart';
import { StatusBar } from 'react-native';
import { Title } from '../../components/Title/Title';
import { routes } from '../../assets/helper/helper.routes';

export const ProfileLivreurScreen = ({ navigation }) => {

    const user = global && global['user'];
    const ref = React.useRef();
    const [showmore, setshowmore] = React.useState(true);

    const handlDeconnexion = () => {
        ref.current.confirm({
            title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Déconnexion </Text>,
            content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Vous êtes sur le point de vous déconnecter de cet appareil, voulez-vous vraiement continuer  ? </Text>],
            ok: {
                text: 'Continue',
                style: {
                    color: Colors.primaryColor,
                    fontFamily: 'mons'
                },
                callback: () => {
                    try {
                        onDeconnextion((err, done) => {
                            if (done) {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Logout',
                                    text2: 'Successfuly loggedout',
                                });
                                RNRestart.Restart()
                            } else {
                                console.log("error => ", err);
                                Toast.show({
                                    type: 'error',
                                    text1: 'Logout',
                                    text2: 'An error occured, try again later !'
                                });
                            }
                        })
                    } catch (error) {
                        Toast.show({
                            type: 'error',
                            text1: 'Logout',
                            text2: 'An error occured, try again later !'
                        });
                        console.log(error);
                    }
                }
            },
            cancel: {
                text: 'Cancel',
                style: {
                    color: Colors.darkColor,
                    fontFamily: "mons-e"
                }
            },
        });
    };

    React.useEffect(() => {
        console.log('====================================');
        console.log(user);
        console.log('====================================');
    }, []);

    return (
        <>
            <Title title={"Profile"} subtitle={"Personalisation du profile"} navigation={navigation} />
            <LinearGradient
                colors={[Colors.primaryColor, Colors.primaryColor]}
                style={{ width: "100%", height: "auto", paddingBottom: 20, flexDirection: "row", alignContent: "center", alignItems: "center", paddingTop: 10 }}
            >
                {user && user['id'] && (
                    <View style={{ width: "100%", alignContent: "center", alignItems: "center", flexDirection: "column", paddingHorizontal: 20 }}>
                        <Avatar
                            rounded
                            title={<Text style={{ fontFamily: "mons-b", textTransform: "uppercase", color: Colors.primaryColor }}>{returnInitialOfNames({ fsname: user && user['nom'], lsname: user && user['postnom'] })}</Text>}
                            size={60}
                            containerStyle={{ backgroundColor: Colors.pillColor, borderColor: Colors.primaryColor }}
                        />
                        <View style={{ marginTop: 10, alignContent: "center", alignItems: "center" }}>
                            <Text style={{ fontFamily: "mons-b", fontSize: Dims.titletextsize, textTransform: "uppercase", color: Colors.pillColor }}>
                                {user && user['nom']}
                                {" "}
                                {user && user['postnom']}
                            </Text>
                            <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}></View>

                            {showmore &&
                                (
                                    <>
                                        <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                                            {/* <FontAwesome name="dot-circle-o" size={Dims.iconsize - 5} color={Colors.whiteColor} /> */}
                                            <Text style={{ fontFamily: "mons-e", color: Colors.whiteColor }}>Sexe</Text>
                                            <Text style={{ fontFamily: "mons", color: Colors.pillColor, fontSize: Dims.subtitletextsize - 2, paddingHorizontal: 5, textAlign: "center" }}>
                                                {user && user['sexe'] && user['sexe']}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                                            <MaterialIcons name="phone" size={Dims.iconsize - 5} color={Colors.whiteColor} />
                                            <Text style={{ fontFamily: "mons", color: Colors.pillColor, fontSize: Dims.subtitletextsize - 2, paddingHorizontal: 5, textAlign: "center" }}>
                                                {user && user['phone'] && user['phone']}
                                            </Text>
                                        </View>
                                        <View>
                                            {user && user['email'] && emailValidator({ email: user && user['email'] }) &&
                                                (
                                                    <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                                                        <MaterialIcons name="email" size={Dims.iconsize - 5} color={Colors.whiteColor} />
                                                        <Text style={{ fontFamily: "mons", color: Colors.pillColor, fontSize: Dims.subtitletextsize - 2, paddingHorizontal: 5, textAlign: "center" }}>
                                                            {user && user['email'] && emailValidator({ email: user && user['email'] }) ? user['email'] : "---"}
                                                        </Text>
                                                    </View>
                                                )
                                            }

                                        </View>
                                    </>

                                )
                            }
                            <View style={{ marginTop: 0 }}>
                                <TouchableHighlight
                                    style={{ padding: 10 }}
                                    underlayColor={Colors.primaryColor}
                                    onPress={() => setshowmore(!showmore)}
                                >
                                    <Feather name={showmore ? "arrow-up-circle" : "arrow-down-circle"} size={Dims.iconsize} color={Colors.whiteColor} />
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                )}
            </LinearGradient>
            <ScrollView
                style={{ paddingHorizontal: 10, backgroundColor: Colors.pillColor }}
                contentContainerStyle={{ paddingBottom: "50%" }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View style={{ marginTop: 30 }}>
                    <View style={{ padding: 5, marginBottom: 10 }}>
                        <Text style={{ fontFamily: "mons-b", textTransform: "uppercase", color: Colors.darkColor }}>Mon compte</Text>
                        <Text style={{ fontFamily: "mons-e", textTransform: "lowercase", color: Colors.darkColor, fontSize: Dims.subtitletextsize }}>Personalisation de mon compte </Text>
                    </View>
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center" }}
                            underlayColor={"transparent"}
                            onPress={() => {
                                Toast.show({
                                    type: 'info',
                                    text1: 'Edit profile',
                                    text2: `Vous devez contacter ${appname} pour cette requête`
                                });
                                // navigation.navigate("") 
                            }
                            }
                        >
                            <>
                                <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                    <MaterialIcons name="edit" size={Dims.iconsize} color={Colors.whiteColor} />
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Changer les informations personneles </Text>
                                </View>
                                <View>
                                    {/* <Text>&nbsp; </Text> */}
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                </View>
                {/* ------------------------------------------------ */}
                <View style={{ marginTop: 30 }}>
                    <View style={{ padding: 5, marginBottom: 10 }}>
                        <Text style={{ fontFamily: "mons-b", textTransform: "uppercase", color: Colors.darkColor }}>Synchronisation</Text>
                        <Text style={{ fontFamily: "mons-e", textTransform: "lowercase", color: Colors.darkColor, fontSize: Dims.subtitletextsize }}>Synchronisation des informations depuis le serveur</Text>
                    </View>
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center" }}
                            underlayColor={"transparent"}
                            onPress={() => {
                                Toast.show({
                                    type: 'info',
                                    text1: 'Synchronisation',
                                    text2: 'Actuellement indisponible'
                                });
                                // navigation.navigate("sync", { item: user }) 
                            }}
                        >
                            <>
                                <View style={{ padding: 8, backgroundColor: Colors.dangerColor }}>
                                    <MaterialIcons name="sync" size={Dims.iconsize} color={Colors.whiteColor} />
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Synchronisation</Text>
                                </View>
                                <View>
                                    <Text>&nbsp;</Text>
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                </View>
                {/* ------------------------------------------------ */}
                <View style={{ marginTop: 30 }}>
                    <View style={{ padding: 5, marginBottom: 10 }}>
                        <Text style={{ fontFamily: "mons-b", textTransform: "uppercase", color: Colors.darkColor }}>Utilisation</Text>
                        <Text style={{ fontFamily: "mons-e", textTransform: "lowercase", color: Colors.darkColor, fontSize: Dims.subtitletextsize }}>Manuel d'utilisation | à propos de {appname}</Text>
                    </View>
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            underlayColor={"transparent"}
                            onPress={() => navigation.navigate(routes['about'])}
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                        <AntDesign name="infocirlce" size={Dims.iconsize} color={Colors.whiteColor} />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>A propos de {appname} </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.primaryColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                    {/* ---------------------------------------------- */}
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                            underlayColor={Colors.whiteColor}
                            onPress={() => {
                                // Linking.openURL("https://www.youtube.com/watch?v=AWlM5zmkcxI")
                                Toast.show({
                                    type: 'info',
                                    text1: 'Manuel d\'utilisation',
                                    text2: 'Actuellement indisponible'
                                });
                            }}
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.pillColor }}>
                                        <MaterialIcons name="file-copy" size={Dims.iconsize} color={Colors.primaryColor} />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Manuel d'utilisation</Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.darkColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                    {/* ---------------------------------------------- */}
                    {/* <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            underlayColor={Colors.whiteColor}
                            onPress={() => {
                                Linking.openURL("https://boratechnology.org")
                            }}
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.pillColor }}>
                                        <MaterialIcons name="privacy-tip" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Privacy </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.darkColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View> */}
                    {/* ---------------------------------------------- */}
                </View>
                {/* ------------------------------------------------ */}
                <View style={{ marginTop: 30 }}>
                    <View style={{ padding: 5, marginBottom: 10 }}>
                        <Text style={{ fontFamily: "mons-b", textTransform: "uppercase", color: Colors.darkColor }}>Paramètres</Text>
                        <Text style={{ fontFamily: "mons-e", textTransform: "lowercase", color: Colors.darkColor, fontSize: Dims.subtitletextsize }}>Configuration et paramètre | les permissions</Text>
                    </View>
                    {/* ---------------------------------------------- */}
                    {/* <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                            underlayColor={"transparent"}
                            onPress={ () => Linking.openSettings() }
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                        <FontAwesome5 name="map-marker-alt" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Geolocation and Map | give permission</Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.primaryColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View> */}
                    {/* ---------------------------------------------- */}
                    {/* <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                            underlayColor={"transparent"}
                            onPress={ () => Linking.openSettings() }
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: 'center', alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                        <MaterialIcons name="notifications" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Push notifications </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.primaryColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View> */}
                    {/* ---------------------------------------------- */}
                    {/* <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"  }}
                            underlayColor={Colors.whiteColor}
                            onPress={() => { navigation.navigate("settings") }}
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.pillColor }}>
                                        <Entypo name="tools" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Configurations </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.primaryColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View> */}
                    {/* ---------------------------------------------- */}
                    {/* <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"  }}
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                        <Fontisto name="world" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Langage </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.primaryColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View> */}
                    {/* ------------------------------------------------ */}
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center" }}
                            underlayColor={"transparent"}
                            onPress={handlDeconnexion}
                        >
                            <>
                                <View style={{ padding: 8, backgroundColor: Colors.inactiveColor }}>
                                    <AntDesign name="logout" size={Dims.iconsize} color={Colors.primaryColor} />
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Déconnexion </Text>
                                </View>
                                <View>
                                    <Text>&nbsp;</Text>
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                    {/* ---------------------------------------------- */}
                </View>
                <Footer />
            </ScrollView>
            {/* < */}
            <DialogBox ref={ref} isOverlayClickClose={true} />
        </>
    )
}