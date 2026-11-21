import { Platform } from 'react-native';

// Mock pour react-native-ble-manager sur Web
if (Platform.OS === 'web') {
  console.warn('[BLE] Bluetooth non disponible sur le Web - utilisation du mock');
}

class BleManagerMock {
  constructor() {
    // Instance methods
  }

  start = () => Promise.resolve();
  stop = () => Promise.resolve();
  scan = () => Promise.resolve([]);
  connect = () => Promise.resolve();
  disconnect = () => Promise.resolve();
  read = () => Promise.resolve('');
  write = () => Promise.resolve();
  startNotification = () => Promise.resolve();
  stopNotification = () => Promise.resolve();
  getConnectedPeripherals = () => Promise.resolve([]);
  getDiscoveredPeripherals = () => Promise.resolve([]);
  on = () => {};
  removeListener = () => {};
  removeAllListeners = () => {};

  // Static methods called directly on the class
  static enableBluetooth = () => Promise.resolve();
  static checkState = () => Promise.resolve();
  static isBluetoothEnabled = () => Promise.resolve(false);
  static getConnectedPeripherals = () => Promise.resolve([]);
  static getDiscoveredPeripherals = () => Promise.resolve([]);
  static start = () => Promise.resolve();
  static stop = () => Promise.resolve();
}

export default BleManagerMock;
export const BleManager = BleManagerMock;