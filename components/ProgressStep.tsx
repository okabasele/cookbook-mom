import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Check } from 'lucide-react-native';
import iOS from '../styles/ios';

interface ProgressStepProps {
  completed: boolean;
  active: boolean;
  label: string;
}

export function ProgressStep({ completed, active, label }: ProgressStepProps) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.indicator,
          completed && styles.indicatorCompleted,
          active && styles.indicatorActive,
        ]}
      >
        {completed ? (
          <Check size={14} color={iOS.colors.systemBackground} strokeWidth={3} />
        ) : active ? (
          <ActivityIndicator size="small" color={iOS.colors.systemBackground} />
        ) : null}
      </View>
      <Text
        style={[
          styles.label,
          completed && styles.labelCompleted,
          active && styles.labelActive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: iOS.spacing.compact,
    paddingVertical: iOS.spacing.compact,
  },

  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: iOS.colors.systemGray5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  indicatorCompleted: {
    backgroundColor: iOS.colors.systemGreen,
  },

  indicatorActive: {
    backgroundColor: iOS.colors.tint,
  },

  label: {
    ...iOS.typography.body,
    color: iOS.colors.secondaryLabel,
  },

  labelCompleted: {
    color: iOS.colors.systemGreen,
  },

  labelActive: {
    color: iOS.colors.label,
    fontWeight: '600',
  },
});
