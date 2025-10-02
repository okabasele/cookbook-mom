// ===========================
// 🎨 iOS SYSTEM COLORS & DESIGN
// ===========================
const iOS = {
  colors: {
    systemBackground: '#FFFFFF',
    secondarySystemBackground: '#F2F2F7',
    tertiarySystemBackground: '#FFFFFF',
    groupedBackground: '#F2F2F7',
    label: '#000000',
    secondaryLabel: 'rgba(60, 60, 67, 0.6)',
    tertiaryLabel: 'rgba(60, 60, 67, 0.3)',
    systemFill: 'rgba(120, 120, 128, 0.2)',
    secondarySystemFill: 'rgba(120, 120, 128, 0.16)',
    tertiarySystemFill: 'rgba(118, 118, 128, 0.12)',
    separator: 'rgba(60, 60, 67, 0.29)',
    opaqueSeparator: '#C6C6C8',
    tint: '#8B2B3E',
    tintLight: '#A6495A',
    systemRed: '#FF3B30',
    systemGreen: '#34C759',
    systemBlue: '#007AFF',
    systemGray: '#8E8E93',
    systemGray2: '#AEAEB2',
    systemGray3: '#C7C7CC',
    systemGray4: '#D1D1D6',
    systemGray5: '#E5E5EA',
    systemGray6: '#F2F2F7',
  },

  typography: {
    largeTitle: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.374 },
    title1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: 0.364 },
    title2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: 0.352 },
    title3: { fontSize: 20, fontWeight: '600' as const, letterSpacing: 0.38 },
    headline: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.408 },
    body: { fontSize: 17, fontWeight: '400' as const, letterSpacing: -0.408 },
    callout: { fontSize: 16, fontWeight: '400' as const, letterSpacing: -0.32 },
    subheadline: { fontSize: 15, fontWeight: '400' as const, letterSpacing: -0.24 },
    footnote: { fontSize: 13, fontWeight: '400' as const, letterSpacing: -0.078 },
    caption1: { fontSize: 12, fontWeight: '400' as const, letterSpacing: 0 },
  },

  spacing: {
    statusBar: 47,
    navBar: 44,
    standard: 16,
    compact: 8,
  },
};

export default iOS;