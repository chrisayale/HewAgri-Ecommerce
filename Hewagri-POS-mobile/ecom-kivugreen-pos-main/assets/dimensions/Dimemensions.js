import { Dimensions, Platform } from "react-native";

const { width: screenWidth, height: screenHeight } = Platform.OS === 'web'
  ? { width: typeof window !== 'undefined' ? window.innerWidth : 375, height: typeof window !== 'undefined' ? window.innerHeight : 667 }
  : Dimensions.get("screen");

export const Dims = {
    iconsize: 18,
    bigiconsize: 72,
    bigtitletextsize: 25,
    titletextsize: 13,
    subtitletextsize: 13,
    borderradius: 5,
    iputtextsize: 14,
    bigradius: 35,
    smallradius: 20,
    inputHeight: 48,
    width: screenWidth,
    height: screenHeight
}