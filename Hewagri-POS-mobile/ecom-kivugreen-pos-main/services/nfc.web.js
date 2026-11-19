import { Platform } from 'react-native';

// Mock pour react-native-nfc-manager sur Web
if (Platform.OS === 'web') {
  console.warn('[NFC] NFC non disponible sur le Web - utilisation du mock');
}

const NfcManagerMock = {
  start: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  registerTagEvent: () => Promise.resolve(),
  unregisterTagEvent: () => Promise.resolve(),
  setEventListener: () => {},
  removeEventListener: () => {},
  requestTechnology: () => Promise.resolve(),
  getTag: () => Promise.resolve(null),
  isSupported: () => Promise.resolve(false),
  isEnabled: () => Promise.resolve(false),
};

export default NfcManagerMock;
export const NfcManager = NfcManagerMock;