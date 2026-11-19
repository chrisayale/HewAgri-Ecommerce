// Web polyfill for react-native PlatformColorValueTypes
// Based on react-native/Libraries/StyleSheet/PlatformColorValueTypes.ios.js

export type SystemColorName = 
  | 'SystemRedColor'
  | 'SystemGreenColor'
  | 'SystemBlueColor'
  | 'SystemOrangeColor'
  | 'SystemYellowColor'
  | 'SystemPinkColor'
  | 'SystemPurpleColor'
  | 'SystemTealColor'
  | 'SystemIndigoColor'
  | 'SystemGrayColor'
  | 'SystemGray2Color'
  | 'SystemGray3Color'
  | 'SystemGray4Color'
  | 'SystemGray5Color'
  | 'SystemGray6Color'
  | 'LabelColor'
  | 'SecondaryLabelColor'
  | 'TertiaryLabelColor'
  | 'QuaternaryLabelColor'
  | 'LinkColor'
  | 'PlaceholderTextColor'
  | 'SeparatorColor'
  | 'OpaqueSeparatorColor'
  | 'SystemBackgroundColor'
  | 'SecondarySystemBackgroundColor'
  | 'TertiarySystemBackgroundColor'
  | 'SystemGroupedBackgroundColor'
  | 'SecondarySystemGroupedBackgroundColor'
  | 'TertiarySystemGroupedBackgroundColor'
  | 'SystemFillColor'
  | 'SecondarySystemFillColor'
  | 'TertiarySystemFillColor'
  | 'QuaternarySystemFillColor';

export type PlatformColorValue = {
  // iOS
  systemColorName?: SystemColorName;
  // Android
  resourceIdentifier?: number;
};

// For web, we just use a simple object type
export type NativeColorValue = PlatformColorValue;

export default NativeColorValue;
