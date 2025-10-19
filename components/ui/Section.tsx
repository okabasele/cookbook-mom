import iOS from '@/styles/ios';
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

type SectionProps = {
  title: string;
  count?: number;
  children?: React.ReactNode;
  footer?: string;
};

const Section = ({ title, count, children, footer }: SectionProps) => (
  <>
    <Text style={styles.sectionHeader}>
      {title} {count !== undefined && `(${count})`}
    </Text>
    <View style={styles.section}>{children}</View>
    {footer && (
      <View style={styles.sectionFooter}>
        <Text style={styles.sectionFooterText}>{footer}</Text>
      </View>
    )}
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
  sectionFooter: {
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: iOS.spacing.standard,
  },
  sectionFooterText: {
    ...iOS.typography.footnote,
    color: iOS.colors.secondaryLabel,
    lineHeight: 18,
  },
});

export default Section;
