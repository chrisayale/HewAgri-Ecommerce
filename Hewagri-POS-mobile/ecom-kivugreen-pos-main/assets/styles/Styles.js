import { StyleSheet, Platform } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  ComponentTokens,
  Layout,
} from '../tokens/DesignTokens';

// Helper to sanitize style values (remove undefined/null and web-incompatible props)
export function sanitizeStyle(style) {
  if (!style || typeof style !== 'object') return style;
  if (Array.isArray(style)) {
    return style.map(item => sanitizeStyle(item)).filter(item => item !== undefined && item !== null);
  }
  const sanitized = {};
  for (const [key, value] of Object.entries(style)) {
    if (value !== undefined && value !== null) {
      // Skip web-incompatible style properties
      if (key === 'boxShadow' || (Platform.OS === 'web' && key === 'elevation')) {
        continue;
      }
      if (typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = sanitizeStyle(value);
      } else if (typeof value !== 'function') {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
}

// Helper to safely create styles with error handling
export function createStylesSafe(rawStyles, styleName = 'unknown') {
  const sanitized = sanitizeStyle(rawStyles);

  const isUnitaryStyle = Object.values(sanitized).some(
    v => v && typeof v === 'object' && !Array.isArray(v) &&
    Object.values(v).some(v2 => typeof v2 !== 'object' || v2 === null)
  );

  try {
    if (isUnitaryStyle) {
      return StyleSheet.create({ item: sanitized }).item;
    }
    return StyleSheet.create(sanitized);
  } catch (e) {
    return sanitized;
  }
}

// ============================================================================
// BASE STYLE PRIMITIVES
// ============================================================================

// Button base styles
const _btnBase = sanitizeStyle({
  borderRadius: BorderRadius.button,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  ...Shadows.shadow.sm,
});

const _btnPrimary = sanitizeStyle({
  ..._btnBase,
  backgroundColor: Colors.primary[500],
  ...Shadows.colored.primary,
});

const _btnSecondary = sanitizeStyle({
  ..._btnBase,
  backgroundColor: Colors.neutral[100],
  borderWidth: 1,
  borderColor: Colors.border.main,
});

const _btnOutline = sanitizeStyle({
  ..._btnBase,
  backgroundColor: 'transparent',
  borderWidth: 1.5,
  borderColor: Colors.primary[500],
});

const _btnGhost = sanitizeStyle({
  ..._btnBase,
  backgroundColor: 'transparent',
});

const _btnDanger = sanitizeStyle({
  ..._btnBase,
  backgroundColor: Colors.danger.main,
  ...Shadows.colored.danger,
});

const _btnDisabled = sanitizeStyle({
  ..._btnBase,
  backgroundColor: Colors.neutral[300],
  opacity: 0.6,
});

// Button sizes
const _btnSizeSm = sanitizeStyle({
  height: ComponentTokens.button.height.sm,
  paddingHorizontal: ComponentTokens.button.paddingHorizontal.sm,
});

const _btnSizeMd = sanitizeStyle({
  height: ComponentTokens.button.height.md,
  paddingHorizontal: ComponentTokens.button.paddingHorizontal.md,
});

const _btnSizeLg = sanitizeStyle({
  height: ComponentTokens.button.height.lg,
  paddingHorizontal: ComponentTokens.button.paddingHorizontal.lg,
});

const _btnSizeXl = sanitizeStyle({
  height: ComponentTokens.button.height.xl,
  paddingHorizontal: ComponentTokens.button.paddingHorizontal.xl,
});

// Input base styles
const _inputBase = sanitizeStyle({
  borderRadius: BorderRadius.input,
  borderWidth: ComponentTokens.input.borderWidth,
  borderColor: Colors.border.main,
  backgroundColor: Colors.surface.primary,
  color: Colors.text.primary,
  fontFamily: Typography.fontFamily.regular,
  fontSize: ComponentTokens.input.fontSize,
  paddingHorizontal: ComponentTokens.input.paddingHorizontal,
  paddingVertical: ComponentTokens.input.paddingVertical,
});

const _inputFocused = sanitizeStyle({
  ..._inputBase,
  borderColor: Colors.border.focus,
  borderWidth: 2,
  ...Shadows.shadow.sm,
});

const _inputError = sanitizeStyle({
  ..._inputBase,
  borderColor: Colors.border.error,
  borderWidth: 2,
});

const _inputDisabled = sanitizeStyle({
  ..._inputBase,
  backgroundColor: Colors.neutral[100],
  color: Colors.text.disabled,
  borderColor: Colors.border.light,
});

const _inputLabel = sanitizeStyle({
  fontFamily: Typography.fontFamily.medium,
  fontSize: Typography.fontSize.sm,
  color: Colors.text.primary,
  marginBottom: Spacing.fieldGap,
});

const _inputHelperText = sanitizeStyle({
  fontFamily: Typography.fontFamily.regular,
  fontSize: Typography.fontSize.xs,
  color: Colors.text.tertiary,
  marginTop: Spacing.xs,
});

const _inputErrorText = sanitizeStyle({
  fontFamily: Typography.fontFamily.medium,
  fontSize: Typography.fontSize.xs,
  color: Colors.danger.main,
  marginTop: Spacing.xs,
});

// Card base styles
const _cardBase = sanitizeStyle({
  backgroundColor: ComponentTokens.card.backgroundColor,
  borderRadius: ComponentTokens.card.borderRadius,
  borderWidth: ComponentTokens.card.borderWidth,
  borderColor: Colors.border.light,
  padding: ComponentTokens.card.padding,
  ...ComponentTokens.card.shadow,
});

const _cardElevated = sanitizeStyle({
  ..._cardBase,
  ...Shadows.shadow.md,
});

const _cardOutlined = sanitizeStyle({
  ..._cardBase,
  borderWidth: 1,
  borderColor: Colors.border.main,
  ...Shadows.shadow.none,
});

const _cardFilled = sanitizeStyle({
  ..._cardBase,
  backgroundColor: Colors.surface.secondary,
  borderWidth: 0,
  ...Shadows.shadow.none,
});

// Screen container
const _screenContainer = sanitizeStyle({
  flex: 1,
  backgroundColor: Colors.background.primary,
  paddingHorizontal: Spacing.screenPaddingHorizontal,
  paddingVertical: Spacing.screenPaddingVertical,
});

const _screenContainerCentered = sanitizeStyle({
  ..._screenContainer,
  alignItems: 'center',
  justifyContent: 'center',
});

// Section styles
const _section = sanitizeStyle({
  width: '100%',
  marginBottom: Spacing.sectionGap,
});

const _sectionTitle = sanitizeStyle({
  fontFamily: Typography.fontFamily.bold,
  fontSize: Typography.fontSize.xl,
  color: Colors.text.primary,
  marginBottom: Spacing.md,
});

const _sectionSubtitle = sanitizeStyle({
  fontFamily: Typography.fontFamily.regular,
  fontSize: Typography.fontSize.md,
  color: Colors.text.secondary,
  marginBottom: Spacing.lg,
});

// Divider
const _divider = sanitizeStyle({
  height: ComponentTokens.divider.thickness,
  backgroundColor: Colors.border.light,
  marginVertical: ComponentTokens.divider.verticalMargin,
});

const _dividerVertical = sanitizeStyle({
  width: ComponentTokens.divider.thickness,
  backgroundColor: Colors.border.light,
  marginHorizontal: ComponentTokens.divider.verticalMargin,
});

// Avatar
const _avatarBase = sanitizeStyle({
  borderRadius: ComponentTokens.avatar.borderRadius,
  backgroundColor: Colors.neutral[200],
  justifyContent: 'center',
  alignItems: 'center',
});

// Badge
const _badgeBase = sanitizeStyle({
  minWidth: ComponentTokens.badge.minWidth,
  height: ComponentTokens.badge.height,
  borderRadius: ComponentTokens.badge.borderRadius,
  paddingHorizontal: ComponentTokens.badge.paddingHorizontal,
  justifyContent: 'center',
  alignItems: 'center',
});

const _badgePrimary = sanitizeStyle({
  ..._badgeBase,
  backgroundColor: Colors.primary[500],
});

const _badgeSuccess = sanitizeStyle({
  ..._badgeBase,
  backgroundColor: Colors.success.main,
});

const _badgeWarning = sanitizeStyle({
  ..._badgeBase,
  backgroundColor: Colors.warning.main,
});

const _badgeDanger = sanitizeStyle({
  ..._badgeBase,
  backgroundColor: Colors.danger.main,
});

const _badgeNeutral = sanitizeStyle({
  ..._badgeBase,
  backgroundColor: Colors.neutral[200],
});

// Chip
const _chipBase = sanitizeStyle({
  height: ComponentTokens.chip.height,
  paddingHorizontal: ComponentTokens.chip.paddingHorizontal,
  borderRadius: ComponentTokens.chip.borderRadius,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.xs,
});

const _chipOutline = sanitizeStyle({
  ..._chipBase,
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: Colors.border.main,
});

const _chipFilled = sanitizeStyle({
  ..._chipBase,
  backgroundColor: Colors.neutral[100],
});

const _chipPrimary = sanitizeStyle({
  ..._chipBase,
  backgroundColor: Colors.primary[500],
});

// Modal
const _modalOverlay = sanitizeStyle({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: Spacing.md,
  zIndex: Layout.zIndex.modalBackdrop,
});

const _modalContent = sanitizeStyle({
  backgroundColor: Colors.surface.primary,
  borderRadius: ComponentTokens.modal.borderRadius,
  padding: ComponentTokens.modal.padding,
  maxWidth: ComponentTokens.modal.maxWidth,
  width: '100%',
  maxHeight: '90%',
  ...Shadows.shadow.xl,
  zIndex: Layout.zIndex.modal,
});

// List item
const _listItem = sanitizeStyle({
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: ComponentTokens.listItem.paddingHorizontal,
  paddingVertical: ComponentTokens.listItem.paddingVertical,
  minHeight: ComponentTokens.listItem.minHeight,
  backgroundColor: Colors.surface.primary,
  borderBottomWidth: 1,
  borderBottomColor: Colors.border.light,
});

const _listItemLast = sanitizeStyle({
  ..._listItem,
  borderBottomWidth: 0,
});

// Typography styles
const _textStyles = sanitizeStyle({
  // Headings
  h1: { ...Typography.styles.h1, fontFamily: Typography.fontFamily.bold, color: Colors.text.primary },
  h2: { ...Typography.styles.h2, fontFamily: Typography.fontFamily.bold, color: Colors.text.primary },
  h3: { ...Typography.styles.h3, fontFamily: Typography.fontFamily.bold, color: Colors.text.primary },
  h4: { ...Typography.styles.h4, fontFamily: Typography.fontFamily.semibold, color: Colors.text.primary },
  h5: { ...Typography.styles.h5, fontFamily: Typography.fontFamily.semibold, color: Colors.text.primary },
  h6: { ...Typography.styles.h6, fontFamily: Typography.fontFamily.semibold, color: Colors.text.primary },

  // Body
  bodyLarge: { ...Typography.styles.bodyLarge, fontFamily: Typography.fontFamily.regular, color: Colors.text.primary },
  bodyMedium: { ...Typography.styles.bodyMedium, fontFamily: Typography.fontFamily.regular, color: Colors.text.primary },
  bodySmall: { ...Typography.styles.bodySmall, fontFamily: Typography.fontFamily.regular, color: Colors.text.secondary },

  // Labels
  labelLarge: { ...Typography.styles.labelLarge, fontFamily: Typography.fontFamily.medium, color: Colors.text.primary },
  labelMedium: { ...Typography.styles.labelMedium, fontFamily: Typography.fontFamily.medium, color: Colors.text.primary },
  labelSmall: { ...Typography.styles.labelSmall, fontFamily: Typography.fontFamily.medium, color: Colors.text.tertiary },

  // Button
  buttonLarge: { ...Typography.styles.buttonLarge, fontFamily: Typography.fontFamily.semibold, color: Colors.text.inverse },
  buttonMedium: { ...Typography.styles.buttonMedium, fontFamily: Typography.fontFamily.semibold, color: Colors.text.inverse },
  buttonSmall: { ...Typography.styles.buttonSmall, fontFamily: Typography.fontFamily.semibold, color: Colors.text.inverse },

  // Caption
  caption: { ...Typography.styles.caption, fontFamily: Typography.fontFamily.regular, color: Colors.text.tertiary },
  overline: { ...Typography.styles.overline, fontFamily: Typography.fontFamily.medium, color: Colors.text.tertiary },

  // Special
  link: { fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.base, color: Colors.primary[500], textDecorationLine: 'underline' },
  linkSmall: { fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.sm, color: Colors.primary[500], textDecorationLine: 'underline' },
});

// Form field group
const _fieldGroup = sanitizeStyle({
  width: '100%',
  marginBottom: Spacing.fieldGroupGap,
});

const _fieldRow = sanitizeStyle({
  flexDirection: 'row',
  gap: Spacing.md,
  width: '100%',
});

const _fieldRowItem = sanitizeStyle({
  flex: 1,
});

// Grid
const _gridContainer = sanitizeStyle({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -Spacing.sm,
});

const _gridItem = sanitizeStyle({
  paddingHorizontal: Spacing.sm,
  marginBottom: Spacing.md,
});

// Flex utilities
const _flex = sanitizeStyle({
  flex: 1,
});

const _flexRow = sanitizeStyle({
  flexDirection: 'row',
  alignItems: 'center',
});

const _flexRowBetween = sanitizeStyle({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const _flexRowCenter = sanitizeStyle({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const _flexCol = sanitizeStyle({
  flexDirection: 'column',
});

const _flexColCenter = sanitizeStyle({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

// Position utilities
const _absoluteFill = sanitizeStyle({
  ...StyleSheet.absoluteFillObject,
});

const _absoluteCenter = sanitizeStyle({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: [{ translateX: -50 }, { translateY: -50 }],
});

// Touchable/Interaction states
const _touchableOpacity = sanitizeStyle({
  activeOpacity: 0.7,
});

const _touchableHighlight = sanitizeStyle({
  underlayColor: Colors.neutral[200],
});

// Loading/Spinner
const _loadingContainer = sanitizeStyle({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: Colors.overlay.light,
});

const _loadingOverlay = sanitizeStyle({
  ...StyleSheet.absoluteFillObject,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: Colors.overlay.medium,
  zIndex: Layout.zIndex.toast,
});

// Error/Empty states
const _emptyState = sanitizeStyle({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: Spacing.xl,
  paddingVertical: Spacing['3xl'],
});

const _emptyStateIcon = sanitizeStyle({
  marginBottom: Spacing.lg,
  opacity: 0.5,
});

const _emptyStateTitle = sanitizeStyle({
  ..._textStyles.h4,
  textAlign: 'center',
  marginBottom: Spacing.sm,
});

const _emptyStateMessage = sanitizeStyle({
  ..._textStyles.bodyMedium,
  textAlign: 'center',
  color: Colors.text.secondary,
  marginBottom: Spacing.lg,
});

// ============================================================================
// COMPOSED COMPONENT STYLES (ready to use)
// ============================================================================

// Button variants (composed)
const btn = _btnSizeMd;
const btnPrimary = { ..._btnPrimary, ..._btnSizeMd };
const btnPrimarySm = { ..._btnPrimary, ..._btnSizeSm };
const btnPrimaryLg = { ..._btnPrimary, ..._btnSizeLg };
const btnPrimaryXl = { ..._btnPrimary, ..._btnSizeXl };

const btnSecondary = { ..._btnSecondary, ..._btnSizeMd };
const btnSecondarySm = { ..._btnSecondary, ..._btnSizeSm };
const btnSecondaryLg = { ..._btnSecondary, ..._btnSizeLg };

const btnOutline = { ..._btnOutline, ..._btnSizeMd };
const btnOutlineSm = { ..._btnOutline, ..._btnSizeSm };
const btnOutlineLg = { ..._btnOutline, ..._btnSizeLg };

const btnGhost = { ..._btnGhost, ..._btnSizeMd };
const btnGhostSm = { ..._btnGhost, ..._btnSizeSm };
const btnGhostLg = { ..._btnGhost, ..._btnSizeLg };

const btnDanger = { ..._btnDanger, ..._btnSizeMd };
const btnDangerSm = { ..._btnDanger, ..._btnSizeSm };
const btnDangerLg = { ..._btnDanger, ..._btnSizeLg };

const btnDisabled = { ..._btnDisabled, ..._btnSizeMd };

// Input variants
const input = _inputBase;
const inputFocused = _inputFocused;
const inputError = _inputError;
const inputDisabled = _inputDisabled;
const inputLabel = _inputLabel;
const inputHelperText = _inputHelperText;
const inputErrorText = _inputErrorText;

// Card variants
const card = _cardBase;
const cardElevated = _cardElevated;
const cardOutlined = _cardOutlined;
const cardFilled = _cardFilled;

// Screen containers
const screenContainer = _screenContainer;
const screenContainerCentered = _screenContainerCentered;

// Section
const section = _section;
const sectionTitle = _sectionTitle;
const sectionSubtitle = _sectionSubtitle;

// Divider
const divider = _divider;
const dividerVertical = _dividerVertical;

// Avatar sizes
const avatarXs = { ..._avatarBase, width: ComponentTokens.avatar.size.xs, height: ComponentTokens.avatar.size.xs };
const avatarSm = { ..._avatarBase, width: ComponentTokens.avatar.size.sm, height: ComponentTokens.avatar.size.sm };
const avatarMd = { ..._avatarBase, width: ComponentTokens.avatar.size.md, height: ComponentTokens.avatar.size.md };
const avatarLg = { ..._avatarBase, width: ComponentTokens.avatar.size.lg, height: ComponentTokens.avatar.size.lg };
const avatarXl = { ..._avatarBase, width: ComponentTokens.avatar.size.xl, height: ComponentTokens.avatar.size.xl };
const avatar2xl = { ..._avatarBase, width: ComponentTokens.avatar.size['2xl'], height: ComponentTokens.avatar.size['2xl'] };

// Badge variants
const badge = _badgePrimary;
const badgePrimary = _badgePrimary;
const badgeSuccess = _badgeSuccess;
const badgeWarning = _badgeWarning;
const badgeDanger = _badgeDanger;
const badgeNeutral = _badgeNeutral;

// Chip variants
const chip = _chipOutline;
const chipOutline = _chipOutline;
const chipFilled = _chipFilled;
const chipPrimary = _chipPrimary;

// Modal
const modalOverlay = _modalOverlay;
const modalContent = _modalContent;

// List item
const listItem = _listItem;
const listItemLast = _listItemLast;

// Typography
const text = _textStyles;

// Form
const fieldGroup = _fieldGroup;
const fieldRow = _fieldRow;
const fieldRowItem = _fieldRowItem;

// Grid
const gridContainer = _gridContainer;
const gridItem = { ..._gridItem, width: '50%' };
const gridItemFull = { ..._gridItem, width: '100%' };
const gridItemThird = { ..._gridItem, width: '33.33%' };
const gridItemQuarter = { ..._gridItem, width: '25%' };

// Flex utilities
const flex = _flex;
const flexRow = _flexRow;
const flexRowBetween = _flexRowBetween;
const flexRowCenter = _flexRowCenter;
const flexCol = _flexCol;
const flexColCenter = _flexColCenter;

// Position
const absoluteFill = _absoluteFill;
const absoluteCenter = _absoluteCenter;

// Interaction
const touchableOpacity = _touchableOpacity;
const touchableHighlight = _touchableHighlight;

// Loading
const loadingContainer = _loadingContainer;
const loadingOverlay = _loadingOverlay;

// Empty state
const emptyState = _emptyState;
const emptyStateIcon = _emptyStateIcon;
const emptyStateTitle = _emptyStateTitle;
const emptyStateMessage = _emptyStateMessage;

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================
const _btnHome = sanitizeStyle({
  width: '100%',
  height: 120,
  alignSelf: 'center',
  padding: Spacing.md,
  backgroundColor: Colors.pillColor,
  borderRadius: BorderRadius.card,
  ...Shadows.shadow.md,
  borderLeftWidth: 3,
  borderLeftColor: Colors.primary[500],
});

const _inputGroup = sanitizeStyle({
  container: {
    width: '100%',
    borderColor: Colors.primary[500],
    borderWidth: 1,
    marginTop: Spacing.xs,
    borderRadius: BorderRadius.input,
    height: ComponentTokens.input.height.md,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  iconcontainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  inputcontainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: Colors.primary[500],
    backgroundColor: Colors.whiteColor,
    height: '100%',
    width: '100%',
    paddingLeft: 25,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
  },
  incon: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  label: {
    fontFamily: Typography.fontFamily.regular,
    paddingLeft: Spacing.sm,
    color: Colors.primary[500],
    fontSize: Typography.fontSize.sm,
  },
});

const _btnHeader = sanitizeStyle({
  borderRadius: BorderRadius.md,
  alignItems: 'center',
  padding: 0,
  justifyContent: 'center',
  backgroundColor: Colors.primary[500],
  borderColor: Colors.whiteColor,
  borderWidth: 0.4,
  ...Shadows.shadow.sm,
  minWidth: 48,
  height: 48,
});

const _btnLegacy = sanitizeStyle({
  width: '100%',
  backgroundColor: Colors.primary[500],
  height: ComponentTokens.button.height.md,
  borderRadius: BorderRadius.button,
  justifyContent: 'center',
  alignItems: 'center',
  ...Shadows.shadow.sm,
});

const _cel = sanitizeStyle({
  color: Colors.primary[500],
  backgroundColor: Colors.pillColor,
  margin: Spacing.sm,
  height: 38,
  width: 38,
  textAlign: 'center',
  fontSize: Typography.fontSize.lg,
  borderRadius: BorderRadius.full,
  justifyContent: 'center',
  alignItems: 'center',
});

const _dropdown = sanitizeStyle({
  dropdownButtonStyle: {
    width: '100%',
    height: ComponentTokens.input.height.md,
    backgroundColor: Colors.surface.primary,
    borderRadius: BorderRadius.input,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ComponentTokens.input.paddingHorizontal,
    borderWidth: 1,
    borderColor: Colors.border.main,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily.regular,
  },
  dropdownButtonArrowStyle: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  dropdownButtonIconStyle: {
    fontSize: 20,
    marginRight: Spacing.sm,
    color: Colors.text.tertiary,
  },
  dropdownMenuStyle: {
    backgroundColor: Colors.surface.primary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.main,
    ...Shadows.shadow.md,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.primary,
  },
  dropdownItemIconStyle: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
});

const _btnCircleStyle = sanitizeStyle({
  width: 56,
  height: 56,
  borderRadius: BorderRadius.full,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.primary[500],
  padding: Spacing.sm,
  ...Shadows.shadow.md,
});

const _styles = sanitizeStyle({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  button: {
    marginVertical: Spacing.xs,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
  },
  btnCircle: _btnCircleStyle,
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: Colors.text.tertiary,
    borderRadius: BorderRadius.full,
  },
  img: {
    width: 30,
    height: 30,
  },
});

// ============================================================================
// CREATE STYLESHEET
// ============================================================================
const _allRawStyles = {
  // New design system styles
  btn,
  btnPrimary,
  btnPrimarySm,
  btnPrimaryLg,
  btnPrimaryXl,
  btnSecondary,
  btnSecondarySm,
  btnSecondaryLg,
  btnOutline,
  btnOutlineSm,
  btnOutlineLg,
  btnGhost,
  btnGhostSm,
  btnGhostLg,
  btnDanger,
  btnDangerSm,
  btnDangerLg,
  btnDisabled,

  // Use raw (pre-StyleSheet) versions for styles that need composition
  input: _inputBase,
  inputFocused: _inputFocused,
  inputError: _inputError,
  inputDisabled: _inputDisabled,
  inputLabel: _inputLabel,
  inputHelperText: _inputHelperText,
  inputErrorText: _inputErrorText,

  card: _cardBase,
  cardElevated: _cardElevated,
  cardOutlined: _cardOutlined,
  cardFilled: _cardFilled,

  screenContainer: _screenContainer,
  screenContainerCentered: _screenContainerCentered,

  section: _section,
  sectionTitle: _sectionTitle,
  sectionSubtitle: _sectionSubtitle,

  divider: _divider,
  dividerVertical: _dividerVertical,

  avatarXs,
  avatarSm,
  avatarMd,
  avatarLg,
  avatarXl,
  avatar2xl,

  badge,
  badgePrimary,
  badgeSuccess,
  badgeWarning,
  badgeDanger,
  badgeNeutral,

  chip,
  chipOutline,
  chipFilled,
  chipPrimary,

  modalOverlay,
  modalContent,

  listItem,
  listItemLast,

  text,
  fieldGroup,
  fieldRow,
  fieldRowItem,

  gridContainer,
  gridItem,
  gridItemFull,
  gridItemThird,
  gridItemQuarter,

  flex,
  flexRow,
  flexRowBetween,
  flexRowCenter,
  flexCol,
  flexColCenter,

  absoluteFill,
  absoluteCenter,

  touchableOpacity,
  touchableHighlight,

  loadingContainer,
  loadingOverlay,

  emptyState,
  emptyStateIcon,
  emptyStateTitle,
  emptyStateMessage,

  // Legacy styles (for backward compatibility)
  btnHome: _btnHome,
  inputGroup: _inputGroup,
  btnHeader: _btnHeader,
  btn: _btnLegacy,
  cel: _cel,
  dropdown: _dropdown,
  styles: _styles,
};

const _allStyles = StyleSheet.create(_allRawStyles);

// ============================================================================
// EXPORTS
// ============================================================================
// New design system - button variants (already declared as const, export them)
export {
  btn,
  btnPrimary,
  btnPrimarySm,
  btnPrimaryLg,
  btnPrimaryXl,
  btnSecondary,
  btnSecondarySm,
  btnSecondaryLg,
  btnOutline,
  btnOutlineSm,
  btnOutlineLg,
  btnGhost,
  btnGhostSm,
  btnGhostLg,
  btnDanger,
  btnDangerSm,
  btnDangerLg,
  btnDisabled,

  // Input styles - use raw (pre-StyleSheet) versions for composition
  input,
  inputFocused,
  inputError,
  inputDisabled,
  inputLabel,
  inputHelperText,
  inputErrorText,

  // Card styles - use raw versions for composition
  card,
  cardElevated,
  cardOutlined,
  cardFilled,

  screenContainer,
  screenContainerCentered,

  section,
  sectionTitle,
  sectionSubtitle,

  divider,
  dividerVertical,

  avatarXs,
  avatarSm,
  avatarMd,
  avatarLg,
  avatarXl,
  avatar2xl,

  badge,
  badgePrimary,
  badgeSuccess,
  badgeWarning,
  badgeDanger,
  badgeNeutral,

  chip,
  chipOutline,
  chipFilled,
  chipPrimary,

  modalOverlay,
  modalContent,

  listItem,
  listItemLast,

  text,
  fieldGroup,
  fieldRow,
  fieldRowItem,

  gridContainer,
  gridItem,
  gridItemFull,
  gridItemThird,
  gridItemQuarter,

  flex,
  flexRow,
  flexRowBetween,
  flexRowCenter,
  flexCol,
  flexColCenter,

  absoluteFill,
  absoluteCenter,

  touchableOpacity,
  touchableHighlight,

  loadingContainer,
  loadingOverlay,

  emptyState,
  emptyStateIcon,
  emptyStateTitle,
  emptyStateMessage,
};

// Legacy exports (from _allRawStyles which has StyleSheet-created versions for legacy)
export const btnHome = _allRawStyles.btnHome;
export const inputGroup = _allRawStyles.inputGroup;
export const btnHeader = _allRawStyles.btnHeader;
export const btnLegacy = _allRawStyles.btn;  // renamed from 'btn' to avoid conflict with const btn above
export const cel = _allRawStyles.cel;
export const dropdown = _allRawStyles.dropdown;
export const styles = _allRawStyles.styles;

// Raw styles export for cases where StyleSheet.create is not wanted
export const rawStyles = _allRawStyles;

// Re-export tokens for convenience
export { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentTokens, Layout, Motion, IconSizes, Responsive } from '../tokens/DesignTokens';