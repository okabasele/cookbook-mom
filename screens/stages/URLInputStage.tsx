import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import iOS from '../../styles/ios';
import Button from '@/components/ui/Button';

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

interface URLInputStageProps {
  youtubeUrl: string;
  onUrlChange: (url: string) => void;
  targetLang: string;
  onLangPress: () => void;
  urlError: string;
  onAnalyze: () => void;
}

export function URLInputStage({
  youtubeUrl,
  onUrlChange,
  targetLang,
  onLangPress,
  urlError,
  onAnalyze,
}: URLInputStageProps) {
  const selectedLanguage = LANGUAGES.find((l) => l.code === targetLang);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>📺</Text>
        <Text style={styles.title}>Importez une recette YouTube</Text>
        <Text style={styles.subtitle}>Collez le lien et choisissez la langue</Text>
      </View>

      {/* URL Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Lien YouTube</Text>
        <TextInput
          value={youtubeUrl}
          onChangeText={onUrlChange}
          placeholder="https://youtube.com/watch?v=..."
          placeholderTextColor={iOS.colors.tertiaryLabel}
          style={[styles.input, urlError && styles.inputError]}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="done"
          onSubmitEditing={onAnalyze}
        />
        {urlError ? (
          <Text style={styles.errorText}>{urlError}</Text>
        ) : null}
      </View>

      {/* Language Selector */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Traduire en</Text>
        <TouchableOpacity style={styles.languageButton} onPress={onLangPress}>
          <View style={styles.languageContent}>
            <Text style={styles.flag}>{selectedLanguage?.flag}</Text>
            <Text style={styles.languageName}>{selectedLanguage?.name}</Text>
          </View>
          <ChevronRight size={20} color={iOS.colors.tertiaryLabel} />
        </TouchableOpacity>
      </View>

      {/* Analyze Button */}
      <Button title="Analyser et traduire" onPress={onAnalyze} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: iOS.spacing.standard * 2,
  },

  hero: {
    alignItems: 'center',
    marginBottom: iOS.spacing.standard * 2,
  },

  emoji: {
    fontSize: 80,
    marginBottom: iOS.spacing.standard,
  },

  title: {
    ...iOS.typography.title2,
    color: iOS.colors.label,
    textAlign: 'center',
    marginBottom: iOS.spacing.compact,
  },

  subtitle: {
    ...iOS.typography.body,
    color: iOS.colors.secondaryLabel,
    textAlign: 'center',
  },

  inputGroup: {
    marginBottom: iOS.spacing.standard,
  },

  label: {
    ...iOS.typography.footnote,
    color: iOS.colors.secondaryLabel,
    marginBottom: iOS.spacing.compact,
  },

  input: {
    ...iOS.typography.body,
    color: iOS.colors.label,
    backgroundColor: iOS.colors.systemBackground,
    borderWidth: 1,
    borderColor: iOS.colors.separator,
    borderRadius: 10,
    padding: iOS.spacing.standard,
  },

  inputError: {
    borderColor: iOS.colors.tint,
    borderWidth: 2,
  },

  errorText: {
    ...iOS.typography.footnote,
    color: iOS.colors.tint,
    marginTop: iOS.spacing.compact,
  },

  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: iOS.colors.systemBackground,
    borderWidth: 1,
    borderColor: iOS.colors.separator,
    borderRadius: 10,
    padding: iOS.spacing.standard,
    minHeight: 50,
  },

  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: iOS.spacing.compact,
  },

  flag: {
    fontSize: 24,
  },

  languageName: {
    ...iOS.typography.body,
    color: iOS.colors.label,
  },
});
