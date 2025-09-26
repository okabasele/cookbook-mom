import { StyleSheet } from 'react-native';

export const theme = {
  colors: {
    primary: '#2563eb',
    success: '#16a34a', 
    danger: '#dc2626',
    warning: '#f59e0b',
    background: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#d1d5db',
    borderLight: '#e5e7eb',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    blue50: '#eff6ff',
    blue100: '#dbeafe',
    green50: '#f0fdf4',
    red50: '#fef2f2'
  },
  typography: {
    title: { fontSize: 28, fontWeight: 'bold' as const, lineHeight: 34 },
    subtitle: { fontSize: 20, fontWeight: 'bold' as const, lineHeight: 26 },
    body: { fontSize: 18, lineHeight: 24 },
    bodyLarge: { fontSize: 20, lineHeight: 26 },
    button: { fontSize: 18, fontWeight: '600' as const },
    caption: { fontSize: 16, lineHeight: 20 },
    captionSmall: { fontSize: 14, lineHeight: 18 }
  },
  spacing: {
    xs: 4, 
    sm: 8, 
    md: 16, 
    lg: 24, 
    xl: 32,
    xxl: 40
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16
  }
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Buttons
  button: {
    height: 60,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  
  secondaryButton: {
    backgroundColor: theme.colors.textSecondary,
  },
  
  dangerButton: {
    backgroundColor: theme.colors.danger,
  },
  
  buttonText: {
    color: theme.colors.background,
    ...theme.typography.button,
    textAlign: 'center',
  },
  
  // Cards
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Text styles
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  
  subtitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
  },
  
  body: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  
  bodySecondary: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  
  caption: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  
  // Form elements
  input: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  },
  
  inputFocused: {
    borderColor: theme.colors.primary,
  },
  
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  
  // Loading states
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
  loadingText: {
    ...theme.typography.subtitle,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  
  // Empty states
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: theme.spacing.xxl,
  },
  
  emptyTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  
  emptySubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});