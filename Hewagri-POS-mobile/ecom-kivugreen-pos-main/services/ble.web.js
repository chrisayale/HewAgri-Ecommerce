import { Platform } from 'react-native';

// Mock pour react-native-ble-manager sur Web
if (Platform.OS === 'web') {
  console.warn('[BLE] Bluetooth non disponible sur le Web - utilisation du mock');
}

const BleManagerMock = {
  start: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  scan: () => Promise.resolve([]),
  connect: () => Promise.resolve(),
  disconnect: () => Promise.resolve(),
  read: () => Promise.resolve(''),
  write: () => Promise.resolve(),
  startNotification: () => Promise.resolve(),
  stopNotification: () => Promise.resolve(),
  getConnectedPeripherals: () => Promise.resolve([]),
  getDiscoveredPeripherals: () => Promise.resolve([]),
  on: () => {},
  removeListener: () => {},
  removeAllListeners: () => {},
};

export default BleManagerMock;
export const BleManager = BleManagerMock;