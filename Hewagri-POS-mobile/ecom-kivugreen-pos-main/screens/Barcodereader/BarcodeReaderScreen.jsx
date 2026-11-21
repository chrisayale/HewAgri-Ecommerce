import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Camera } from 'expo-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DialogBox from 'react-native-dialogbox';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import BarcodeMask from 'react-native-barcode-mask';
import { createStylesSafe } from '../../assets/styles/Styles';

export const BarcodereaderScreen = ({ navigation }) => {
  const dialogbox = React.useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [lightmd, setlightmode] = React.useState(Camera.Constants.FlashMode.off);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const onBarCodeScanned = ({ data, target, type }) => {
    // const scnatype = 2048;
    // if (type === scnatype) {
    //   navigation.navigate("displaydatareaded", { data, target, type })
    // } else {
    //   dialogbox.current.confirm({
    //     title: <Text style={{ fontFamily: "Mons-b" }}>PDF 417 | QRCode | Barcode Reader</Text>,
    //     content: [<Text style={{ fontFamily: "Mons" }}>Le code bar scanné est incorrect, veuillez scanner un code bar correcte</Text>],
    //     ok: {
    //       text: "Re-Scanner",
    //       style: {
    //         fontFamily: "Mons-b",
    //         color: Colors.primaryColor
    //       }
    //     },
    //     cancel: {
    //       text: "Annuler",
    //       style: {
    //         fontFamily: "Mons",
    //         color: Colors.primaryColor
    //       },
    //       callback: () => navigation.navigate("Balabala")
    //     }
    //   })
    // }
  }
  const toggletype = () => {
    setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
  }
  const togglelight = () => {
    setlightmode(lightmd === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off)
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Aucun acces à la camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}
        onBarCodeScanned={onBarCodeScanned}
        flashMode={lightmd}
      >
        <BarcodeMask outerMaskOpacity={0.8} lineAnimationDuration={800} />
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
      </Camera>
      <DialogBox ref={dialogbox} />
    </View>
  );
}

const _rawStyles = {
  container: {
    flex: 1,
  },
  camera: {
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
};

const styles = createStylesSafe(_rawStyles, 'BarcodeReaderScreen');