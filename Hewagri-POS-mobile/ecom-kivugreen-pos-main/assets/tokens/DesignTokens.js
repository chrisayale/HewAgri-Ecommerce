// Design Tokens - Unified Design System for HewAgri POS
// Centralized tokens for colors, typography, spacing, shadows, border radius, etc.
// These tokens ensure consistency across all screens and components

import { Platform } from 'react-native';

// ============================================================================
// COLOR TOKENS
// ============================================================================
export const Colors = {
  // Primary brand colors (HewAgri Green)
  primary: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#048343',  // Main brand color
    600: '#037038',
    700: '#025D2D',
    800: '#024A22',
    900: '#013717',
    950: '#00240C',
  },

  // Semantic colors
  success: {
    light: '#4CAF50',
    main: '#048343',
    dark: '#037038',
    contrastText: '#FFFFFF',
  },

  danger: {
    light: '#EF5350',
    main: '#FF1F00',
    dark: '#D32F2F',
    contrastText: '#FFFFFF',
  },

  warning: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
    contrastText: '#000000',
  },

  info: {
    light: '#64B5F6',
    main: '#2196F3',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },

  // Neutral colors
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#151E26',
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#EEEEEE',
    inverse: '#151E26',
  },

  // Surface colors
  surface: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F5F5F5',
    variant: '#EEEEEE',
  },

  // Text colors
  text: {
    primary: '#151E26',
    secondary: '#424242',
    tertiary: '#757575',
    disabled: '#9E9E9E',
    inverse: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onSurface: '#151E26',
    onSurfaceVariant: '#424242',
  },

  // Border colors
  border: {
    light: '#E0E0E0',
    main: '#BDBDBD',
    dark: '#9E9E9E',
    focus: '#048343',
    error: '#FF1F00',
  },

  // Overlay colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.16)',
    dark: 'rgba(0, 0, 0, 0.32)',
    modal: 'rgba(0, 0, 0, 0.5)',
  },

  // Status colors (for specific UI states)
  status: {
    online: '#048343',
    offline: '#9E9E9E',
    busy: '#FF9800',
    away: '#2196F3',
  },

  // Legacy color names for backward compatibility
  primaryColor: '#048343',
  secondaryColor: '#c822ff',
  pillColor: '#EEEEEE',
  successColor: '#048343',
  dangerColor: '#FF1F00',
  whiteColor: '#FFFFFF',
  yellow: '#ccc92a',
  darkColor: '#474747',
  placeHolderColor: '#9C9696',
  neutreColor: '#FFFFFF',
  pInRGBA: 'rgba(4,131,67,.2)',
  dInRGBA: 'rgba(255,31,0,.2)',
  textColor: '#151E26',
  greyColor: '#9C9696',
  borderColor: '#E0E0E0',
  inactiveColor: '#9E9E9E',
};

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================
export const Typography = {
  // Font families
  fontFamily: {
    regular: 'mons',
    medium: 'mons-m',
    bold: 'mons-b',
    extraBold: 'mons-e',
    light: 'mons-l',
  },

  // Font sizes (in px) - 4px base scale
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },

  // Text styles (composable)
  styles: {
    // Headings
    h1: { fontSize: 36, lineHeight: 1.2, fontWeight: '700', letterSpacing: -0.5 },
    h2: { fontSize: 30, lineHeight: 1.2, fontWeight: '700', letterSpacing: -0.5 },
    h3: { fontSize: 24, lineHeight: 1.3, fontWeight: '600', letterSpacing: -0.25 },
    h4: { fontSize: 20, lineHeight: 1.4, fontWeight: '600', letterSpacing: 0 },
    h5: { fontSize: 18, lineHeight: 1.4, fontWeight: '600', letterSpacing: 0 },
    h6: { fontSize: 16, lineHeight: 1.5, fontWeight: '600', letterSpacing: 0 },

    // Body text
    bodyLarge: { fontSize: 16, lineHeight: 1.5, fontWeight: '400' },
    bodyMedium: { fontSize: 14, lineHeight: 1.5, fontWeight: '400' },
    bodySmall: { fontSize: 12, lineHeight: 1.5, fontWeight: '400' },

    // Labels
    labelLarge: { fontSize: 14, lineHeight: 1.5, fontWeight: '500' },
    labelMedium: { fontSize: 12, lineHeight: 1.5, fontWeight: '500' },
    labelSmall: { fontSize: 11, lineHeight: 1.5, fontWeight: '500' },

    // Button text
    buttonLarge: { fontSize: 16, lineHeight: 1.5, fontWeight: '600' },
    buttonMedium: { fontSize: 14, lineHeight: 1.5, fontWeight: '600' },
    buttonSmall: { fontSize: 12, lineHeight: 1.5, fontWeight: '600' },

    // Caption/overline
    caption: { fontSize: 11, lineHeight: 1.5, fontWeight: '400' },
    overline: { fontSize: 10, lineHeight: 1.5, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1 },
  },
};

// ============================================================================
// SPACING TOKENS
// ============================================================================
// Based on 4px base unit - 8px grid system
export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,

  // Semantic spacing aliases
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,

  // Component-specific spacing
  inputPaddingHorizontal: 16,
  inputPaddingVertical: 12,
  buttonPaddingHorizontal: 24,
  buttonPaddingVertical: 14,
  cardPadding: 16,
  cardGap: 16,
  screenPaddingHorizontal: 16,
  screenPaddingVertical: 24,
  sectionGap: 32,
  fieldGap: 8,
  fieldGroupGap: 20,
};

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,

  // Component-specific
  button: 8,
  input: 8,
  card: 12,
  modal: 16,
  badge: 9999,
  fab: 28,
};

// ============================================================================
// SHADOW / ELEVATION TOKENS
// ============================================================================
// Cross-platform shadows (iOS/Android/Web compatible)
export const Shadows = {
  // Elevation levels (Material Design inspired)
  elevation: {
    0: { shadowOpacity: 0, elevation: 0, boxShadow: 'none' },
    1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    },
    3: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    4: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 4,
      boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
    },
    5: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 5,
      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
    },
  },

  // Semantic shadows
  shadow: {
    none: { shadowOpacity: 0, elevation: 0, boxShadow: 'none' },
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 4,
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 5,
      boxShadow: '0 16px 24px rgba(0,0,0,0.12)',
    },
    inner: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 0,
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
    },
  },

  // Colored shadows (for primary actions)
  colored: {
    primary: {
      shadowColor: '#048343',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
      boxShadow: '0 4px 12px rgba(4, 131, 67, 0.3)',
    },
    danger: {
      shadowColor: '#FF1F00',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
      boxShadow: '0 4px 12px rgba(255, 31, 0, 0.3)',
    },
  },
};

// ============================================================================
// LAYOUT / CONTAINER TOKENS
// ============================================================================
export const Layout = {
  // Breakpoints (for responsive design)
  breakpoints: {
    xs: 0,
    sm: 375,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  // Container max widths
  container: {
    xs: '100%',
    sm: 375,
    md: 720,
    lg: 960,
    xl: 1140,
    '2xl': 1320,
    full: '100%',
  },

  // Grid
  grid: {
    columns: 12,
    gutter: 16,
    gutterSm: 12,
    gutterMd: 16,
    gutterLg: 24,
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
    toast: 1700,
  },
};

// ============================================================================
// ANIMATION / TRANSITION TOKENS
// ============================================================================
export const Motion = {
  // Durations (ms)
  duration: {
    instant: 0,
    fastest: 50,
    fast: 100,
    normal: 200,
    slow: 300,
    slower: 500,
    slowest: 700,
  },

  // Easing curves
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Custom cubic-bezier curves
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    emphasized: 'cubic-bezier(0.2, 0.0, 0, 1)',
  },

  // Spring configs (for react-native-reanimated or similar)
  spring: {
    gentle: { damping: 20, stiffness: 150 },
    default: { damping: 15, stiffness: 150 },
    bouncy: { damping: 10, stiffness: 150 },
    stiff: { damping: 25, stiffness: 200 },
  },
};

// ============================================================================
// ICON SIZE TOKENS
// ============================================================================
export const IconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,

  // Semantic
  button: 20,
  input: 20,
  header: 24,
  tab: 24,
  fab: 24,
  card: 32,
  feature: 48,
};

// ============================================================================
// COMPONENT-SPECIFIC TOKEN OVERRIDES
// ============================================================================
export const ComponentTokens = {
  // Button
  button: {
    height: {
      sm: 36,
      md: 44,
      lg: 52,
      xl: 60,
    },
    paddingHorizontal: {
      sm: 12,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: BorderRadius.button,
    fontWeight: Typography.fontWeight.semibold,
  },

  // Input
  input: {
    height: {
      sm: 40,
      md: 48,
      lg: 56,
    },
    paddingHorizontal: Spacing.inputPaddingHorizontal,
    paddingVertical: Spacing.inputPaddingVertical,
    borderRadius: BorderRadius.input,
    borderWidth: 1,
    fontSize: Typography.fontSize.base,
    placeholderOpacity: 0.5,
  },

  // Card
  card: {
    padding: Spacing.cardPadding,
    gap: Spacing.cardGap,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    backgroundColor: Colors.surface.primary,
    shadow: Shadows.shadow.sm,
  },

  // Modal
  modal: {
    borderRadius: BorderRadius.modal,
    padding: Spacing.lg,
    maxWidth: 560,
    backdropOpacity: 0.5,
  },

  // List item
  listItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },

  // Divider
  divider: {
    thickness: 1,
    color: Colors.border.light,
    verticalMargin: Spacing.md,
  },

  // Badge
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: BorderRadius.badge,
    paddingHorizontal: 6,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },

  // Avatar
  avatar: {
    size: {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
      '2xl': 80,
    },
    borderRadius: BorderRadius.full,
  },

  // Chip
  chip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },

  // Tooltip
  tooltip: {
    maxWidth: 280,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    fontSize: Typography.fontSize.sm,
    backgroundColor: Colors.neutral[900],
    color: Colors.neutral[0],
  },

  // Snackbar / Toast
  snackbar: {
    minWidth: 288,
    maxWidth: 568,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    fontSize: Typography.fontSize.base,
  },
};

// ============================================================================
// RESPONSIVE HELPERS
// ============================================================================
export const Responsive = {
  // Get value based on screen width
  getValue: (width, values) => {
    const { xs, sm, md, lg, xl, '2xl': xxl } = Layout.breakpoints;
    if (width >= xxl) return values['2xl'] ?? values.xl ?? values.lg ?? values.md ?? values.sm ?? values.xs;
    if (width >= xl) return values.xl ?? values.lg ?? values.md ?? values.sm ?? values.xs;
    if (width >= lg) return values.lg ?? values.md ?? values.sm ?? values.xs;
    if (width >= md) return values.md ?? values.sm ?? values.xs;
    if (width >= sm) return values.sm ?? values.xs;
    return values.xs;
  },

  // Common responsive patterns
  isMobile: (width) => width < Layout.breakpoints.md,
  isTablet: (width) => width >= Layout.breakpoints.md && width < Layout.breakpoints.lg,
  isDesktop: (width) => width >= Layout.breakpoints.lg,

  // Responsive container width
  containerWidth: (width) => {
    if (width >= Layout.breakpoints.xl) return Layout.container.xl;
    if (width >= Layout.breakpoints.lg) return Layout.container.lg;
    if (width >= Layout.breakpoints.md) return Layout.container.md;
    if (width >= Layout.breakpoints.sm) return Layout.container.sm;
    return Layout.container.xs;
  },
};

// ============================================================================
// EXPORT ALL TOKENS
// ============================================================================
export const DesignTokens = {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Layout,
  Motion,
  IconSizes,
  ComponentTokens,
  Responsive,
};

export default DesignTokens;