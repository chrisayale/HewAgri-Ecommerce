/**
 * Platform polyfill for react-native-web
 * This provides the Platform module that react-native's internal modules expect
 */
const Platform = {
  OS: 'web',
  select: function select(obj) {
    return 'web' in obj ? obj.web : obj.default;
  },
  get isTesting() {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
      return true;
    }
    return false;
  },
  Version: '0.0.0',
  constants: {
    reactNativeVersion: {
      major: 0,
      minor: 68,
      patch: 2
    }
  }
};

module.exports = Platform;
module.exports.default = Platform;
