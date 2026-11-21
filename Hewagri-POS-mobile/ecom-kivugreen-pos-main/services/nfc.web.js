import { Platform } from 'react-native';

// Mock pour react-native-nfc-manager sur Web
if (Platform.OS === 'web') {
  console.warn('[NFC] NFC non disponible sur le Web - utilisation du mock');
}

// Technologies NFC
const NfcTech = {
  Ndef: 'Ndef',
  NfcA: 'NfcA',
  NfcB: 'NfcB',
  NfcF: 'NfcF',
  NfcV: 'NfcV',
  IsoDep: 'IsoDep',
  MifareClassic: 'MifareClassic',
  MifareUltralight: 'MifareUltralight',
  NdefFormatable: 'NdefFormatable',
};

const NfcManagerMock = {
  start: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  registerTagEvent: () => Promise.resolve(),
  unregisterTagEvent: () => Promise.resolve(),
  setEventListener: () => {},
  removeEventListener: () => {},
  requestTechnology: (tech) => Promise.resolve(),
  getTag: () => Promise.resolve(null),
  isSupported: () => Promise.resolve(false),
  isEnabled: () => Promise.resolve(false),

  // Propriétés/constantes attendues
  NfcTech,
  NfcEvents: {
    DiscoverTag: 'DiscoverTag',
    ReadTag: 'ReadTag',
    SessionClosed: 'SessionClosed',
    TagLost: 'TagLost',
  },

  // Méthodes supplémentaires parfois utilisées
  getTagId: () => Promise.resolve(''),
  setAlertMessage: () => Promise.resolve(),
  disableReaderMode: () => Promise.resolve(),
  enableReaderMode: () => Promise.resolve(),
};

export default NfcManagerMock;
export const NfcManager = NfcManagerMock;
export { NfcTech };