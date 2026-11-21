import { Colors } from "../colors/Colors";
import { Dims } from "../dimensions/Dimemensions";
import { StyleSheet, Platform } from "react-native";

// Helper pour nettoyer les valeurs undefined/null d'un objet de style
export function sanitizeStyle(style) {
  if (!style || typeof style !== 'object') return style;
  // Handle arrays
  if (Array.isArray(style)) {
    return style.map(item => sanitizeStyle(item)).filter(item => item !== undefined && item !== null);
  }
  const sanitized = {};
  for (const [key, value] of Object.entries(style)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = sanitizeStyle(value);
      } else if (typeof value !== 'function') {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
}

// Helper pour créer les styles avec gestion d'erreur
// Accepte soit un objet de styles nommés { styleName: {...} }, soit un objet de style unitaire {...}
// Si c'est un style unitaire, l'enveloppe dans { item: style } et retourne .item
export function createStylesSafe(rawStyles, styleName = 'unknown') {
  const sanitized = sanitizeStyle(rawStyles);

  // Détecter si c'est un style unitaire (pas de clés qui sont des noms de styles)
  // Un style unitaire a des valeurs qui sont des primitives (strings, numbers) ou des objets de propriétés CSS
  // Un dictionnaire de styles a des valeurs qui sont elles-mêmes des objets de style
  const isUnitaryStyle = Object.values(sanitized).some(
    v => v && typeof v === 'object' && !Array.isArray(v) &&
    Object.values(v).some(v2 => typeof v2 !== 'object' || v2 === null)
  );

  try {
    if (isUnitaryStyle) {
      // Style unitaire : l'envelopper et extraire
      return StyleSheet.create({ item: sanitized }).item;
    }
    // Dictionnaire de styles nommés : créer directement
    return StyleSheet.create(sanitized);
  } catch (e) {
    // Fallback silencieux : retourner l'objet sanitized sans StyleSheet.create
    return sanitized;
  }
}

// Valeurs par défaut définitives (ne dépendent d'aucun import)
const DEFAULT_COLORS = {
  primaryColor: "#048343",
  secondaryColor: "#c822ff",
  pillColor: "#EEEEEE",
  successColor: "#048343",
  dangerColor: "#FF1F00",
  whiteColor: "#FFFF",
  yellow: "#ccc92a",
  darkColor: "#474747",
  placeHolderColor: "#9C9696",
  neutreColor: "#fff",
  pInRGBA: "rgba(4,131,67,.2)",
  dInRGBA: "rgba(255,31,0,.2)",
  textColor: "#151E26",
  greyColor: "#9C9696",
  borderColor: "#E0E0E0",
  inactiveColor: "#9E9E9E",
};

const DEFAULT_DIMS = {
  iconsize: 18,
  bigiconsize: 72,
  bigtitletextsize: 25,
  titletextsize: 13,
  subtitletextsize: 13,
  borderradius: 5,
  iputtextsize: 14,
  bigradius: 35,
  smallradius: 20,
  inputHeight: 48,
  width: 375,
  height: 667,
};

// Fusion défensive : utilise l'import si dispo, sinon fallback, et pour chaque propriété assure une valeur
const C = {
  primaryColor: Colors?.primaryColor ?? DEFAULT_COLORS.primaryColor,
  secondaryColor: Colors?.secondaryColor ?? DEFAULT_COLORS.secondaryColor,
  pillColor: Colors?.pillColor ?? DEFAULT_COLORS.pillColor,
  successColor: Colors?.successColor ?? DEFAULT_COLORS.successColor,
  dangerColor: Colors?.dangerColor ?? DEFAULT_COLORS.dangerColor,
  whiteColor: Colors?.whiteColor ?? DEFAULT_COLORS.whiteColor,
  yellow: Colors?.yellow ?? DEFAULT_COLORS.yellow,
  darkColor: Colors?.darkColor ?? DEFAULT_COLORS.darkColor,
  placeHolderColor: Colors?.placeHolderColor ?? DEFAULT_COLORS.placeHolderColor,
  neutreColor: Colors?.neutreColor ?? DEFAULT_COLORS.neutreColor,
  pInRGBA: Colors?.pInRGBA ?? DEFAULT_COLORS.pInRGBA,
  dInRGBA: Colors?.dInRGBA ?? DEFAULT_COLORS.dInRGBA,
  textColor: Colors?.textColor ?? DEFAULT_COLORS.textColor,
  greyColor: Colors?.greyColor ?? DEFAULT_COLORS.greyColor,
  borderColor: Colors?.borderColor ?? DEFAULT_COLORS.borderColor,
  inactiveColor: Colors?.inactiveColor ?? DEFAULT_COLORS.inactiveColor,
};

const D = {
  iconsize: Dims?.iconsize ?? DEFAULT_DIMS.iconsize,
  bigiconsize: Dims?.bigiconsize ?? DEFAULT_DIMS.bigiconsize,
  bigtitletextsize: Dims?.bigtitletextsize ?? DEFAULT_DIMS.bigtitletextsize,
  titletextsize: Dims?.titletextsize ?? DEFAULT_DIMS.titletextsize,
  subtitletextsize: Dims?.subtitletextsize ?? DEFAULT_DIMS.subtitletextsize,
  borderradius: Dims?.borderradius ?? DEFAULT_DIMS.borderradius,
  iputtextsize: Dims?.iputtextsize ?? DEFAULT_DIMS.iputtextsize,
  bigradius: Dims?.bigradius ?? DEFAULT_DIMS.bigradius,
  smallradius: Dims?.smallradius ?? DEFAULT_DIMS.smallradius,
  inputHeight: Dims?.inputHeight ?? DEFAULT_DIMS.inputHeight,
  width: Dims?.width ?? DEFAULT_DIMS.width,
  height: Dims?.height ?? DEFAULT_DIMS.height,
};

// Styles bruts (objets JS purs) - utilisent le sanitizeStyle exporté
const _btnHome = sanitizeStyle({
  width: "100%",
  height: 120,
  alignSelf: "center",
  padding: 10,
  backgroundColor: C.pillColor,
  borderRadius: 10,
  elevation: 4,
  borderRightColor: C.primaryColor,
  borderLeftWidth: 2,
  borderLeftColor: C.primaryColor,
});

const _inputGroup = sanitizeStyle({
  container: {
    width: "100%",
    borderColor: C.primaryColor,
    borderWidth: 0.6,
    marginTop: 5,
    borderRadius: D.borderradius,
    height: D.inputHeight,
    flexDirection: "row",
    overflow: "hidden",
  },
  iconcontainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  inputcontainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    color: C.primaryColor,
    backgroundColor: C.whiteColor,
    height: "100%",
    width: "100%",
    paddingLeft: 25,
    fontSize: D.iputtextsize,
  },
  incon: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  label: {
    fontFamily: "mons",
    paddingLeft: 10,
    color: C.primaryColor,
  },
});

const _btnHeader = sanitizeStyle({
  borderRadius: 12,
  alignItems: "center",
  padding: 0,
  justifyContent: "center",
  backgroundColor: C.primaryColor,
  borderColor: C.whiteColor,
  borderWidth: 0.4,
  elevation: 2,
});

const _btn = sanitizeStyle({
  width: "100%",
  backgroundColor: C.primaryColor,
  height: D.inputHeight,
  borderRadius: D.borderradius,
  justifyContent: "center",
  alignItems: "center",
});

const _cel = sanitizeStyle({
  color: C.primaryColor,
  backgroundColor: C.pillColor,
  margin: 6,
  height: 38,
  width: 38,
  textAlign: "center",
  fontSize: D.iputtextsize + 8,
  // justifyContent removed - not valid for Text components
});

const _dropdown = sanitizeStyle({
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: D.iputtextsize,
    color: C.darkColor,
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: C.whiteColor,
    borderRadius: 0,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});

// Convert iOS shadow props to boxShadow for web
const _btnCircleStyle = {
  width: 60,
  height: 60,
  borderRadius: 35,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: C.primaryColor,
  padding: 10,
  bottom: 30,
  // Platform-specific shadows
  ...(Platform.OS === 'web'
    ? { boxShadow: '0 0.5px 1.41px rgba(0,0,0,0.2)' }
    : {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 1,
      }),
};

const _styles = sanitizeStyle({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    marginVertical: 5,
  },
  bottomBar: {
    position: "absolute",
    bottom: -7,
    padding: 0,
    margin: 0,
  },
  btnCircle: _btnCircleStyle,
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: "gray",
  },
  img: {
    width: 30,
    height: 30,
  },
});

// Regrouper tous les styles dans un seul dictionnaire pour un seul appel à StyleSheet.create
// StyleSheet.create attend { styleName: { ...properties } }, pas un objet de propriétés direct
const _allRawStyles = {
  btnHome: _btnHome,
  inputGroup: _inputGroup,
  btnHeader: _btnHeader,
  btn: _btn,
  cel: _cel,
  dropdown: _dropdown,
  styles: _styles,
};

// Un seul appel à StyleSheet.create pour tous les styles
const _allStyles = StyleSheet.create(_allRawStyles);

// Extraire chaque style nommé du résultat
export const btnHome = _allStyles.btnHome;
export const inputGroup = _allStyles.inputGroup;
export const btnHeader = _allStyles.btnHeader;
export const btn = _allStyles.btn;
export const cel = _allStyles.cel;
export const dropdown = _allStyles.dropdown;
export const styles = _allStyles.styles;

// Export des styles bruts pour les cas où StyleSheet.create n'est pas voulu
export const rawStyles = _allRawStyles;