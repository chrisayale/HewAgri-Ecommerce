const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Alias pour les modules natifs non compatibles Web
  config.resolve.alias = {
    ...config.resolve.alias,
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
  };

  // Configuration du serveur de développement
  config.devServer = {
    ...config.devServer,
    port: 4005,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    hot: true,
    client: {
      overlay: true,
    },
  };

  return config;
};
