import iOS from '@/styles/ios';
import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type InfoRowProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  hideDivider?: boolean;
}

const InfoRow = ({ label, value, icon, onPress, hideDivider }: InfoRowProps) => (
  <TouchableOpacity style={hideDivider? styles.infoRow:styles.infoRowWithDivider} onPress={onPress}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
    {icon}
  </TouchableOpacity>
);

export default InfoRow

const styles = StyleSheet.create({
      infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: iOS.colors.systemBackground,
    padding: 12,
    paddingHorizontal: iOS.spacing.standard,
    minHeight: 44,
  },
    infoRowWithDivider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: iOS.colors.systemBackground,
    borderBottomWidth: 0.5,
    borderBottomColor: iOS.colors.separator,
    padding: 12,
    paddingHorizontal: iOS.spacing.standard,
    minHeight: 44,
  },
  infoLabel: {
    ...iOS.typography.body,
    color: iOS.colors.label,
  },

  infoValue: {
    ...iOS.typography.body,
    color: iOS.colors.secondaryLabel,
  },
})