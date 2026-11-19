import { Platform } from 'react-native';

// Mock pour rn-fetch-blob sur Web
if (Platform.OS === 'web') {
  console.warn('[RNFetchBlob] rn-fetch-blob non disponible sur le Web - utilisation du mock');
}

const RNFetchBlobMock = {
  config: (options) => ({
    fetch: (method, url, headers, body) => {
      return fetch(url, { method, headers, body })
        .then(response => response.blob())
        .then(blob => ({
          path: () => URL.createObjectURL(blob),
          base64: () => new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
          }),
          text: () => response.text(),
          json: () => response.json(),
        }));
    },
    fs: {
      dirs: {
        DocumentDir: '/',
        SDCardDir: '/',
        CacheDir: '/',
      },
      writeFile: (path, data, encoding) => Promise.resolve(),
      readFile: (path, encoding) => Promise.resolve(''),
      unlink: (path) => Promise.resolve(),
      exists: (path) => Promise.resolve(false),
      mkdir: (path) => Promise.resolve(),
      lstat: (path) => Promise.resolve({ size: 0 }),
    },
  }),
  fs: {
    dirs: {
      DocumentDir: '/',
      SDCardDir: '/',
      CacheDir: '/',
    },
    writeFile: (path, data, encoding) => Promise.resolve(),
    readFile: (path, encoding) => Promise.resolve(''),
    unlink: (path) => Promise.resolve(),
    exists: (path) => Promise.resolve(false),
    mkdir: (path) => Promise.resolve(),
    lstat: (path) => Promise.resolve({ size: 0 }),
  },
};

export default RNFetchBlobMock;
export const RNFetchBlob = RNFetchBlobMock;