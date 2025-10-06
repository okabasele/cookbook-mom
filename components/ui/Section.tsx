import iOS from '@/styles/ios';
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

type SectionProps = {
  title: string;
  count?: number;
  children?: React.ReactNode;
};

const Section = ({ title, count, children }: SectionProps) => (
  <>
    <Text style={styles.sectionHeader}>
      {title} {count !== undefined && `(${count})`}
    </Text>
    <View style={styles.section}>{children}</View>
  </>
);

const styles = StyleSheet.create({
  section: {
    marginHorizontal: iOS.spacing.standard,
    marginBottom: iOS.spacing.standard,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: iOS.colors.systemBackground,
  },
  sectionHeader: {
    ...iOS.typography.footnote,
    color: iOS.colors.secondaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: iOS.spacing.standard,
    paddingTop: 12,
    paddingBottom: 8,
  },
});

export default Section;
