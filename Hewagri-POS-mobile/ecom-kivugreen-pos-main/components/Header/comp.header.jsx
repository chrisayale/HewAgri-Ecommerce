import * as React from 'react';
import { View, Text, StatusBar, Image, Platform } from 'react-native';
import { Divider } from 'react-native-paper';
import { Colors } from '../../assets/styles/Styles';
import { appname } from '../../assets/configs/configs';

export const Header = ({ colors }) => {
    return(
        <>
            <StatusBar backgroundColor={ Colors.primaryColor } barStyle={ colors ? "light-content" : "default" } />
            <View style={{ padding: 10, alignContent: "center", alignSelf: "center", marginTop: Platform.OS === 'web' ? 0 : 12, height: 130, justifyContent: "center" }}>
                <Image
                    source={require("../../assets/images/HewAgri_FN-02.png")}
                    style={{
                        width: 180,
                        alignSelf: "center",
                        resizeMode: "contain"
                    }}
                />
                {/* <Text style={{ textAlign: "center", fontFamily: "mons", color: Colors.whiteColor, fontSize: 40, position: "absolute", alignSelf: "center", bottom: 0 }} >{appname} </Text> */}
            </View>
        </>
    )
}