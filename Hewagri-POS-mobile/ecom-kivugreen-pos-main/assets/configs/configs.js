// API Configuration
// Priority: ENV variable > local config > default
const getApiEndpoint = () => {
  // Expo/React Native: use Constants.expoConfig?.extra?.apiEndpoint or process.env
  // For web: window.__ENV__?.API_ENDPOINT or process.env.EXPO_PUBLIC_API_ENDPOINT
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_ENDPOINT) {
    return process.env.EXPO_PUBLIC_API_ENDPOINT;
  }
  if (typeof window !== 'undefined' && window.__ENV__?.API_ENDPOINT) {
    return window.__ENV__.API_ENDPOINT;
  }
  // Default for local development
  return "http://localhost:3002";
};

export const endpoint = getApiEndpoint();

export const appname = "HewAgri POS";
export const appnamecompangyname = "KivuGreen";
export const umergencyphonenumber = "0970284772"
