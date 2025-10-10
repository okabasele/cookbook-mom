import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import iOS from '@/styles/ios';

type NavButtonProps = {
  onPress: () => void;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export const NavButton = ({ onPress, label, icon, disabled }: NavButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.navButton}
      disabled={disabled}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      {label && <Text style={[styles.navButtonText, disabled && styles.navButtonTextDisabled]}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: iOS.spacing.compact,
  },

  navButtonText: {
    ...iOS.typography.body,
    color: iOS.colors.tint,
  },

  navButtonBold: {
    fontWeight: '600',
  },

  navButtonTextDisabled: {
    color: iOS.colors.tertiaryLabel,
  },
});