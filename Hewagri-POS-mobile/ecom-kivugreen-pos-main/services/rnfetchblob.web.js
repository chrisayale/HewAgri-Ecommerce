import { Platform } from 'react-native';

// Mock pour rn-fetch-blob sur Web
if (Platform.OS === 'web') {
  console.warn('[RNFetchBlob] rn-fetch-blob non disponible sur le Web - utilisation du mock');
}

// Dossiers exposés directement sur l'objet principal (comme le module natif)
const dirs = {
  DocumentDir: '/',
  CacheDir: '/',
  PictureDir: '/',
  MusicDir: '/',
  MovieDir: '/',
  DownloadDir: '/',
  DCIMDir: '/',
  SDCardDir: '/',
  SDCardApplicationDir: '/',
};

const fs = {
  dirs,
  writeFile: (path, data, encoding) => Promise.resolve(),
  readFile: (path, encoding) => Promise.resolve(''),
  unlink: (path) => Promise.resolve(),
  exists: (path) => Promise.resolve(false),
  mkdir: (path) => Promise.resolve(),
  lstat: (path) => Promise.resolve({ size: 0 }),
};

const RNFetchBlobMock = {
  // Propriétés attendues directement sur l'objet (natif)
  DocumentDir: dirs.DocumentDir,
  CacheDir: dirs.CacheDir,
  PictureDir: dirs.PictureDir,
  MusicDir: dirs.MusicDir,
  MovieDir: dirs.MovieDir,
  DownloadDir: dirs.DownloadDir,
  DCIMDir: dirs.DCIMDir,
  SDCardDir: dirs.SDCardDir,
  SDCardApplicationDir: dirs.SDCardApplicationDir,
  dirs,

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
    fs,
  }),
  fs,

  // Méthodes supplémentaires
  fetch: (method, url, headers, body) => fetch(url, { method, headers, body }),
  fetchBlob: (method, url, headers, body) => fetch(url, { method, headers, body }),
  polyfill: {},
};

export default RNFetchBlobMock;
export const RNFetchBlob = RNFetchBlobMock;