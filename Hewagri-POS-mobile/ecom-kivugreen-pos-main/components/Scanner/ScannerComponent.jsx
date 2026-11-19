import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Camera, } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DialogBox from 'react-native-dialogbox';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import BarcodeMask from 'react-native-barcode-mask';
import { appname } from '../../assets/configs/configs';

export const BarcodereaderComponenent = ({ navigation, cb, rescann }) => {

  const dialogbox = React.useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState('back');
  const [lightmd, setlightmode] = React.useState(Camera.Constants.FlashMode.off);
  const [scanned, setscanned] = React.useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

  }, []);

  const onBarCodeScanned = ({ data, target, type }) => {
    const scnatype = 2048;
    setscanned(true)
    return cb({ data, target, type })
  }
  const toggletype = () => {
    const m = type === "back" ? "front" : "back"
    // alert(m)
    setType(m)
  }
  const togglelight = () => {
    setlightmode(lightmd === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off)
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <View style={{ flex: 1, width: "100%", height: Dims.height, alignContent: "center", justifyContent: "center", justifyContent: "center" }}>
        <Text style={{ fontFamily: "mons-b" }}>{appname} n'a pas d'accès à votre caméra; accorder d'abord l'accès à {appname} avant de continuer !</Text>
      </View>
    );
  }
  return (
    <>
      <BarCodeScanner
        style={[styles.camera,]}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        onBarCodeScanned={scanned ? undefined : onBarCodeScanned}
        type={type}
        focusable
      // flashMode={lightmd}
      >
        <BarcodeMask
          outerMaskOpacity={0.8}
          lineAnimationDuration={800}
          animatedLineColor={Colors.primaryColor}
          animatedLineHeight={5}
          edgeColor={Colors.primaryColor}
        />
        <View style={{ position: "absolute", flexDirection: "row", bottom: 12, alignContent: "center", justifyContent: "space-around", width: "65%", alignSelf: "center" }}>
          <TouchableHighlight
            style={{ width: 45, height: 45, alignContent: "center", alignItems: "center", backgroundColor: Colors.neutreColor, justifyContent: "center", borderRadius: 12 }}
            onPress={toggletype}>
            <Ionicons name='sync' size={Dims.iconsize} color={Colors.primaryColor} />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={togglelight}
            style={{ width: 45, height: 45, alignContent: "center", alignItems: "center", backgroundColor: Colors.neutreColor, justifyContent: "center", borderRadius: 12 }}>
            <Ionicons name={
              lightmd === Camera.Constants.FlashMode.off ? "flash-outline" : "flash-off-outline"
            } size={Dims.iconsize} color={Colors.primaryColor} />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => navigation.goBack()}
            style={{ width: 45, height: 45, alignContent: "center", alignItems: "center", backgroundColor: Colors.neutreColor, justifyContent: "center", borderRadius: 12 }}
          >
            <Ionicons name='arrow-back-outline' color={Colors.primaryColor} size={Dims.iconsize} />
          </TouchableHighlight>
        </View>
      </BarCodeScanner>
      <DialogBox ref={dialogbox} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: Dims.width,
    height: Dims.height,
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: Colors.whiteColor,
  },
});