import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import iOS from '@/styles/ios';

type InfoBadgeProps = {
  text: string;
  icon: string;
};
const InfoBadge = ({ text, icon }: InfoBadgeProps) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {icon} {text}
      </Text>
    </View>
  );
};
export default InfoBadge;

const styles = StyleSheet.create({
  badge: {
    padding: iOS.spacing.standard,
    paddingBottom: 0,
    alignItems: 'center',
  },

  badgeText: {
    ...iOS.typography.footnote,
    color: iOS.colors.secondaryLabel,
    textAlign: 'center',
  },
});
