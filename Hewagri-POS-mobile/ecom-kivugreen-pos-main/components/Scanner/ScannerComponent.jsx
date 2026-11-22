import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Platform } from 'react-native';
import { Camera, } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DialogBox from 'react-native-dialogbox';
import { Dims } from '../../assets/dimensions/Dimemensions';
import BarcodeMask from 'react-native-barcode-mask';
import { appname } from '../../assets/configs/configs';
import {
  card,
  cardElevated,
  flexRow,
  flexRowBetween,
  flexRowCenter,
  flexColCenter,
  text,
  Spacing,
  BorderRadius,
  Shadows,
  Colors,
  IconSizes,
  Typography,
} from '../../assets/styles/Styles';

export const BarcodereaderComponenent = ({ navigation, cb, rescann, instructionTitle, instructionMessage }) => {

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
    return <View style={styles.loadingContainer} />;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Ionicons name="camera-outline" size={48} color={Colors.text.tertiary} style={{ marginBottom: Spacing.md }} />
          <Text style={{ fontFamily: "mons-b", textAlign: "center", padding: Spacing.md, color: Colors.text.primary, fontSize: 16 }}>
            {appname} n'a pas d'accès à votre caméra; accorder d'abord l'accès à {appname} avant de continuer !
          </Text>
          <TouchableHighlight
            underlayColor={Colors.neutral[200]}
            onPress={() => navigation.goBack()}
            style={{
              marginTop: Spacing.lg,
              paddingHorizontal: Spacing.xl,
              paddingVertical: Spacing.md,
              backgroundColor: Colors.primary[500],
              borderRadius: BorderRadius.md,
              ...Shadows.shadow.sm,
            }}
            activeOpacity={0.9}
          >
            <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b", fontSize: 16 }}>Retour</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  const hasInstructionBanner = instructionTitle || instructionMessage;

  return (
    <>
      <BarCodeScanner
        style={hasInstructionBanner ? styles.cameraWithBanner : styles.camera}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        onBarCodeScanned={scanned ? undefined : onBarCodeScanned}
        type={type}
        focusable
      >
        {hasInstructionBanner && (
          <View style={styles.instructionBanner}>
            <View style={styles.instructionBannerContent}>
              {instructionTitle && (
                <Text style={styles.instructionTitle}>
                  {instructionTitle}
                </Text>
              )}
              {instructionMessage && (
                <Text style={styles.instructionMessage}>
                  {instructionMessage}
                </Text>
              )}
            </View>
          </View>
        )}
        <BarcodeMask
          outerMaskOpacity={0.8}
          lineAnimationDuration={800}
          animatedLineColor={Colors.primary[500]}
          animatedLineHeight={4}
          edgeColor={Colors.primary[500]}
        />
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.button}
            onPress={toggletype}
            activeOpacity={0.8}
            underlayColor="rgba(255,255,255,0.2)"
          >
            <Ionicons name='sync' size={IconSizes.header} color={Colors.whiteColor} />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={togglelight}
            style={styles.button}
            activeOpacity={0.8}
            underlayColor="rgba(255,255,255,0.2)"
          >
            <Ionicons name={
              lightmd === Camera.Constants.FlashMode.off ? "flash-outline" : "flash-off-outline"
            } size={IconSizes.header} color={Colors.whiteColor} />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => navigation.goBack()}
            style={styles.button}
            activeOpacity={0.8}
            underlayColor="rgba(255,255,255,0.2)"
          >
            <Ionicons name='arrow-back-outline' color={Colors.whiteColor} size={IconSizes.header} />
          </TouchableHighlight>
        </View>
      </BarCodeScanner>
      <DialogBox ref={dialogbox} />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xl,
  },
  permissionCard: {
    width: '100%',
    maxWidth: 360,
    padding: Spacing.xl,
    backgroundColor: Colors.surface.primary,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.shadow.lg,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraWithBanner: {
    flex: 1,
    width: '100%',
  },
  instructionBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    zIndex: 10,
    ...Shadows.shadow.md,
  },
  instructionBannerContent: {
    alignItems: 'center',
    maxWidth: '90%',
    alignSelf: 'center',
  },
  instructionTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.fontSize.xl,
    color: Colors.whiteColor,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  instructionMessage: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: Typography.fontSize.md,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: Typography.fontSize.md * 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  button: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BorderRadius.full,
    ...Shadows.shadow.md,
  },
  text: {
    fontSize: 18,
    color: Colors.whiteColor,
  },
});

export default BarcodereaderComponenent;