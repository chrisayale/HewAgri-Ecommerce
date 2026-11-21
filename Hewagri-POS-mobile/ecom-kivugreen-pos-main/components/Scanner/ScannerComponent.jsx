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
      <View style={styles.container}>
        <Text style={{ fontFamily: "mons-b", textAlign: "center", padding: 20 }}>{appname} n'a pas d'accès à votre caméra; accorder d'abord l'accès à {appname} avant de continuer !</Text>
      </View>
    );
  }
  return (
    <>
      <BarCodeScanner
        style={styles.camera}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        onBarCodeScanned={scanned ? undefined : onBarCodeScanned}
        type={type}
        focusable
      >
        <BarcodeMask
          outerMaskOpacity={0.8}
          lineAnimationDuration={800}
          animatedLineColor={Colors.primaryColor}
          animatedLineHeight={5}
          edgeColor={Colors.primaryColor}
        />
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.button}
            onPress={toggletype}>
            <Ionicons name='sync' size={Dims.iconsize} color={Colors.primaryColor} />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={togglelight}
            style={styles.button}>
            <Ionicons name={
              lightmd === Camera.Constants.FlashMode.off ? "flash-outline" : "flash-off-outline"
            } size={Dims.iconsize} color={Colors.primaryColor} />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => navigation.goBack()}
            style={styles.button}
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
    width: '100%',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  button: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutreColor,
    borderRadius: 12,
  },
  text: {
    fontSize: 18,
    color: Colors.whiteColor,
  },
});