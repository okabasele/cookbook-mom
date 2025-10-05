import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import iOS from '../styles/ios';

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

interface LanguagePickerModalProps {
  visible: boolean;
  value: string;
  onChange: (languageCode: string) => void;
  onClose: () => void;
}

export function LanguagePickerModal({ visible, value, onChange, onClose }: LanguagePickerModalProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay} onTouchEnd={onClose}>
        <View style={styles.modal} onTouchEnd={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Traduire en</Text>
          </View>

          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => {
                onChange(lang.code);
                onClose();
              }}
              style={[
                styles.languageOption,
                value === lang.code && styles.languageOptionSelected,
              ]}
            >
              <View style={styles.languageContent}>
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={styles.languageName}>{lang.name}</Text>
              </View>
              {value === lang.code && (
                <Check size={20} color={iOS.colors.tint} strokeWidth={2.5} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: iOS.colors.systemBackground,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: iOS.spacing.standard,
    paddingBottom: 34,
  },

  header: {
    alignItems: 'center',
    paddingBottom: iOS.spacing.standard,
    borderBottomWidth: 0.5,
    borderBottomColor: iOS.colors.separator,
    marginBottom: iOS.spacing.standard,
  },

  headerText: {
    ...iOS.typography.headline,
    color: iOS.colors.label,
  },

  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: iOS.spacing.standard,
    marginBottom: iOS.spacing.compact,
    minHeight: 44,
  },

  languageOptionSelected: {
    backgroundColor: iOS.colors.systemGray6,
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
