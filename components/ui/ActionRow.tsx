import iOS from '@/styles/ios';
import { ChevronRight } from 'lucide-react-native';
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
  // Action Row Component
  const ActionRow = ({
    label,
    onPress,
    isLast = false,
  }: {
    label: string;
    onPress: () => void;
    isLast?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <ChevronRight size={20} color={iOS.colors.tertiaryLabel} />
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    // Row Styles
  row: {
    backgroundColor: iOS.colors.systemBackground,
    paddingVertical: 12,
    paddingHorizontal: iOS.spacing.standard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: iOS.colors.separator,
  },
  rowLabel: {
    ...iOS.typography.body,
    color: iOS.colors.label,
  }
  })

export default ActionRow