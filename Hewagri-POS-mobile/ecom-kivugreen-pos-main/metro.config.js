// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configuration pour le Web (PWA)
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Résolveur pour les fichiers .web.js/.web.jsx
config.resolver.resolverMainFields = ['browser', 'main', 'react-native'];

// Enable package exports support for ESM packages like nanoid
config.resolver.unstable_enablePackageExports = true;

// Add .cjs extension support for packages like nanoid/non-secure
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

// Alias pour les modules natifs non compatibles Web
config.resolver.alias = {
  ...config.resolver.alias,
  // Critical: alias react-native to react-native-web for web platform
  'react-native': 'react-native-web',
  'expo-sqlite': path.resolve(__dirname, 'services/dbconnect/dbconnect.web.js'),
  'react-native-pos-printer': path.resolve(__dirname, 'services/printer.web.js'),
  'expo-barcode-scanner': path.resolve(__dirname, 'components/Scanner/ScannerComponent.web.jsx'),
  'expo-camera': path.resolve(__dirname, 'components/Scanner/ScannerComponent.web.jsx'),
  'react-native-ble-manager': path.resolve(__dirname, 'services/ble.web.js'),
  'react-native-nfc-manager': path.resolve(__dirname, 'services/nfc.web.js'),
  'rn-fetch-blob': path.resolve(__dirname, 'services/rnfetchblob.web.js'),
  'react-native-print': path.resolve(__dirname, 'services/printer.web.js'),
  'react-native-html-to-pdf': path.resolve(__dirname, 'services/htmltopdf.web.js'),
  'react-native-snackbar': path.resolve(__dirname, 'services/snackbar.web.js'),
  // Fix for nanoid/non-secure ESM resolution issue
  'nanoid/non-secure': path.resolve(__dirname, 'services/nanoid-web.js'),
  // Fix for missing PlatformColorValueTypes in react-native web
  './PlatformColorValueTypes': path.resolve(__dirname, 'services/PlatformColorValueTypes.web.js'),
  'react-native/Libraries/StyleSheet/PlatformColorValueTypes': path.resolve(__dirname, 'services/PlatformColorValueTypes.web.js'),
  };

module.exports = config;
