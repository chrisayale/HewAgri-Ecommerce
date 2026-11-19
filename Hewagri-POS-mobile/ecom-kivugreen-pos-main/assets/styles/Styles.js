import { Colors } from "../colors/Colors";
import { Dims } from "../dimensions/Dimemensions";
import { StyleSheet } from "react-native";

export const btnHome = StyleSheet.create({ 
    width: "100%", 
    height: 120, 
    alignSelf: "center", 
    padding: 10, 
    backgroundColor: Colors.pillColor, 
    borderRadius: 10, 
    elevation: 4,
    borderRightColor: Colors.primaryColor, 
    // borderRightWidth: 2,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primaryColor, 
})

export const inputGroup = StyleSheet.create({
    container: {
        width: "100%",
        borderColor: Colors.primaryColor,
        borderWidth: .6,
        marginTop: 5,
        borderRadius: Dims.borderradius,
        height: Dims.inputHeight,
        flexDirection: "row",
        overflow: "hidden"
    },
    iconcontainer: {
        width: "20%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        height: "100%"
    },
    inputcontainer: {
        width: "80%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        color: "lime"
    },
    input: {
        color: Colors.primaryColor,
        backgroundColor: Colors.whiteColor,
        height: "100%",
        width: "100%",
        paddingLeft: 25,
        fontSize: Dims.iputtextsize
    },
    incon: {
        width: "20%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        height: "100%"
    },
    label: {
        fontFamily: "mons",
        paddingLeft: 10,
        color: Colors.primaryColor
    }
});

export const btnHeader = StyleSheet.create({ 
    borderRadius: 12, 
    alignItems: "center", 
    padding: 0, 
    alignContent: "center", 
    justifyContent: "center", 
    backgroundColor: Colors.primaryColor, 
    borderColor: Colors.whiteColor, 
    borderWidth: .4, 
    elevation: 2 
})

export const btn = StyleSheet.create({
    width: "100%",
    backgroundColor: Colors.primaryColor,
    height: Dims.inputHeight,
    borderRadius: Dims.borderradius,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
});

export const cel = StyleSheet.create({
    color: Colors.primaryColor,
    backgroundColor: Colors.pillColor,
    margin: 6,
    height: 38,
    width: 38,
    textAlign: "center",
    fontSize: Dims.iputtextsize + 8,
    justifyContent: "center"
});

export const dropdown = StyleSheet.create({
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: Dims.iputtextsize,
        color: Colors.darkColor,
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: 0,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    button: {
        marginVertical: 5,
    },
    bottomBar: {
        position: "absolute",
        // backgroundColor: "lime",
        bottom: -7,
        padding: 0,
        margin: 0
    },
    btnCircle: {
        width: 60,
        height: 60,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 1,
        bottom: 30,
    },
    imgCircle: {
        width: 30,
        height: 30,
        tintColor: 'gray',
    },
    img: {
        width: 30,
        height: 30,
    },
});