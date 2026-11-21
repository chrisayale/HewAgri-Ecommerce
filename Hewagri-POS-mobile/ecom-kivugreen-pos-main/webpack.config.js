const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Alias pour les modules natifs non compatibles Web
  config.resolve.alias = {
    ...config.resolve.alias,
    // Mock react-native-snackbar pour le web
    'react-native-snackbar': path.resolve(__dirname, 'src/mocks/react-native-snackbar.web.js'),

    // Autres mocks existants (déjà dans metro.config.js mais on les garde pour Webpack aussi)
    'expo-sqlite': path.resolve(__dirname, 'services/dbconnect/dbconnect.web.js'),
    'react-native-pos-printer': path.resolve(__dirname, 'services/printer.web.js'),
    'expo-barcode-scanner': path.resolve(__dirname, 'components/Scanner/ScannerComponent.web.jsx'),
    'expo-camera': path.resolve(__dirname, 'components/Scanner/ScannerComponent.web.jsx'),
    'react-native-ble-manager': path.resolve(__dirname, 'services/ble.web.js'),
    'react-native-nfc-manager': path.resolve(__dirname, 'services/nfc.web.js'),
    'rn-fetch-blob': path.resolve(__dirname, 'services/rnfetchblob.web.js'),
    'react-native-print': path.resolve(__dirname, 'services/printer.web.js'),
    'react-native-html-to-pdf': path.resolve(__dirname, 'services/htmltopdf.web.js'),
    // Fix pour nanoid/non-secure ESM
    'nanoid/non-secure': path.resolve(__dirname, 'services/nanoid-web.js'),
    // Fix pour PlatformColorValueTypes
    './PlatformColorValueTypes': path.resolve(__dirname, 'services/PlatformColorValueTypes.web.js'),
    'react-native/Libraries/StyleSheet/PlatformColorValueTypes': path.resolve(__dirname, 'services/PlatformColorValueTypes.web.js'),
  };

  // S'assurer que les extensions .web.js sont résolues en priorité
  config.resolve.extensions = ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', ...config.resolve.extensions];

  // Supprimer le plugin HtmlWebpackPlugin qui injecte le script Metro obsolète
  // Expo utilise son propre template, on doit surcharger le template HTML
  config.plugins = config.plugins.filter(plugin => {
    // Filtrer HtmlWebpackPlugin qui utilise le template par défaut
    return !(plugin.constructor && plugin.constructor.name === 'HtmlWebpackPlugin');
  });

  // Ajouter notre propre HtmlWebpackPlugin avec le template personnalisé
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'web/index.html'),
      filename: 'index.html',
      inject: true,
      // Ne pas injecter le script Metro obsolète
      excludeChunks: ['metro'],
    })
  );

  return config;
};