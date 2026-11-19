import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Alert } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { appname } from '../../assets/configs/configs';

let BarCodeScanner;
let Camera;

if (Platform.OS !== 'web') {
  try {
    const expoBarcode = require('expo-barcode-scanner');
    const expoCamera = require('expo-camera');
    BarCodeScanner = expoBarcode.BarCodeScanner;
    Camera = expoCamera.Camera;
  } catch (e) {
    console.warn('Native scanner modules not available');
  }
}

export const BarcodereaderComponenent = ({ navigation, cb, rescann }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState('back');
  const [lightMode, setLightMode] = useState('off');
  const [scanned, setScanned] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'web') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: type === 'back' ? 'environment' : 'user' }
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
          setHasPermission(true);
        } catch (error) {
          console.error('Camera access denied:', error);
          setHasPermission(false);
        }
      } else {
        try {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        } catch (error) {
          setHasPermission(false);
        }
      }
    };

    requestPermissions();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [type]);

  const onBarCodeScanned = ({ data, target, type: scanType }) => {
    setScanned(true);
    return cb({ data, target, type: scanType });
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onBarCodeScanned({
        data: manualCode.trim(),
        target: 'manual',
        type: 'manual'
      });
      setManualCode('');
      setShowManualInput(false);
    }
  };

  const toggleType = () => {
    const newType = type === "back" ? "front" : "back";
    setType(newType);

    if (Platform.OS === 'web' && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: newType === 'back' ? 'environment' : 'user' }
      }).then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      });
    }
  };

  const toggleLight = () => {
    setLightMode(prev => prev === 'on' ? 'off' : 'on');
    if (Platform.OS === 'web' && videoRef.current) {
      const track = videoRef.current.srcObject?.getVideoTracks()[0];
      if (track) {
        track.applyConstraints({
          advanced: [{ torch: lightMode === 'off' }]
        }).catch(() => {
          Alert.alert('Flash non disponible', 'Votre navigateur ou appareil ne supporte pas le flash');
        });
      }
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement de la caméra...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          {appname} n'a pas d'accès à votre caméra.
          <Text style={styles.permissionLink}>Autorisez l'accès dans les paramètres du navigateur</Text>
        </Text>
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => setShowManualInput(true)}
        >
          <Text style={styles.manualButtonText}>Saisir le code manuellement</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.videoWrapper}>
          <video
            ref={videoRef}
            style={styles.video}
            autoPlay
            playsInline
            muted
          />
          {scanned && (
            <View style={styles.scannedOverlay}>
              <Text style={styles.scannedText}>Code scanné !</Text>
            </View>
          )}
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleType}>
            <Ionicons name='sync' size={Dims.iconsize} color={Colors.primaryColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={toggleLight}>
            <Ionicons
              name={lightMode === 'off' ? 'flash-outline' : 'flash-off-outline'}
              size={Dims.iconsize}
              color={Colors.primaryColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.manualTrigger]}
            onPress={() => setShowManualInput(true)}
          >
            <Ionicons name='keyboard-outline' size={Dims.iconsize} color={Colors.primaryColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name='arrow-back-outline' color={Colors.primaryColor} size={Dims.iconsize} />
          </TouchableOpacity>
        </View>

        {showManualInput && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Saisie manuelle du code</Text>
              <Text style={styles.modalSubtitle}>Entrez le code-barres ou QR code manuellement</Text>
              <input
                style={styles.modalInput}
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Code-barres / QR Code"
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowManualInput(false)}>
                  <Text style={styles.modalButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirmButton} onPress={handleManualSubmit}>
                  <Text style={styles.modalButtonText}>Valider</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.nativeContainer}>
      <BarCodeScanner
        style={styles.camera}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        onBarCodeScanned={scanned ? undefined : onBarCodeScanned}
        type={type}
        focusable
      >
        <View style={styles.controlsOverlay}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleType}>
            <Ionicons name='sync' size={Dims.iconsize} color={Colors.primaryColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={toggleLight}>
            <Ionicons
              name={lightMode === 'off' ? 'flash-outline' : 'flash-off-outline'}
              size={Dims.iconsize}
              color={Colors.primaryColor}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back-outline' color={Colors.primaryColor} size={Dims.iconsize} />
          </TouchableOpacity>
        </View>
      </BarCodeScanner>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.primaryColor,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 20,
  },
  permissionLink: {
    color: Colors.primaryColor,
    textDecorationLine: 'underline',
  },
  manualButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  manualButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  webContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoWrapper: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  scannedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedText: {
    fontSize: 24,
    color: '#0f0',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  nativeContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: Dims.width,
    height: Dims.height,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: Colors.neutreColor,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  manualTrigger: {
    backgroundColor: Colors.secondaryColor,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.greyColor,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    boxSizing: 'border-box',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: Colors.neutreColor,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    backgroundColor: Colors.primaryColor,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BarcodereaderComponenent;