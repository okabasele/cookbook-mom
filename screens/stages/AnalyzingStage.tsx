import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressStep } from '../../components/ProgressStep';
import iOS from '../../styles/ios';

interface AnalyzingStageProps {
  analysisStep: number;
  selectedLanguageName: string;
}

export function AnalyzingStage({ analysisStep, selectedLanguageName }: AnalyzingStageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚡</Text>

      <Text style={styles.title}>Traitement en cours...</Text>

      <Text style={styles.subtitle}>
        Cela peut prendre quelques secondes
      </Text>

      <View style={styles.progressContainer}>
        <ProgressStep
          completed={analysisStep > 0}
          active={analysisStep === 0}
          label="Extraction de la transcription"
        />
        <ProgressStep
          completed={analysisStep > 1}
          active={analysisStep === 1}
          label={`Traduction en ${selectedLanguageName}`}
        />
        <ProgressStep
          completed={analysisStep > 2}
          active={analysisStep === 2}
          label="Conversion des unités de mesure"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: iOS.spacing.standard * 3,
    alignItems: 'center',
  },

  emoji: {
    fontSize: 72,
    marginBottom: iOS.spacing.standard * 2,
  },

  title: {
    ...iOS.typography.title2,
    color: iOS.colors.label,
    textAlign: 'center',
    marginBottom: iOS.spacing.standard,
  },

  subtitle: {
    ...iOS.typography.body,
    color: iOS.colors.secondaryLabel,
    textAlign: 'center',
    marginBottom: iOS.spacing.standard * 2,
  },

  progressContainer: {
    backgroundColor: iOS.colors.systemBackground,
    borderRadius: 12,
    padding: iOS.spacing.standard,
    alignSelf: 'stretch',
  },
});
