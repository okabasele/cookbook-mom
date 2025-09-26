import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SUPPORTED_LANGUAGES, LanguageOption } from '../types/Recipe';
import { theme, commonStyles } from '../styles/theme';

interface LanguagePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (languageCode: 'en' | 'fr') => void;
  excludeLanguage?: 'en' | 'fr';
  title?: string;
}

export function LanguagePicker({ 
  visible, 
  onClose, 
  onSelect, 
  excludeLanguage,
  title = 'Choisir une langue'
}: LanguagePickerProps) {
  const availableLanguages = excludeLanguage 
    ? SUPPORTED_LANGUAGES.filter(lang => lang.code !== excludeLanguage)
    : SUPPORTED_LANGUAGES;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{title}</Text>
          
          {availableLanguages.map(language => (
            <TouchableOpacity
              key={language.code}
              style={styles.languageOption}
              onPress={() => {
                onSelect(language.code);
                onClose();
              }}
            >
              <Text style={styles.languageOptionText}>
                {language.flag} {language.name}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  
  modal: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  
  modalTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  
  languageOption: {
    ...commonStyles.button,
    backgroundColor: theme.colors.gray50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  
  languageOptionText: {
    ...theme.typography.button,
    color: theme.colors.text,
  },
  
  cancelButton: {
    ...commonStyles.button,
    backgroundColor: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  
  cancelButtonText: {
    ...commonStyles.buttonText,
  },
});