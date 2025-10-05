import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import iOS from '../styles/ios';

const DIFFICULTY_OPTIONS = [
  { value: 'facile', label: 'Facile', emoji: '🟢' },
  { value: 'moyen', label: 'Moyen', emoji: '🟡' },
  { value: 'difficile', label: 'Difficile', emoji: '🔴' },
];

interface DifficultyPickerModalProps {
  visible: boolean;
  value: string;
  onChange: (difficulty: string) => void;
  onClose: () => void;
}

export function DifficultyPickerModal({ visible, value, onChange, onClose }: DifficultyPickerModalProps) {
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
            <Text style={styles.headerText}>Difficulté</Text>
          </View>

          {DIFFICULTY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                onChange(option.value);
                onClose();
              }}
              style={[
                styles.difficultyOption,
                value === option.value && styles.difficultyOptionSelected,
              ]}
            >
              <Text style={styles.emoji}>{option.emoji}</Text>
              <Text style={styles.difficultyLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.validateButton} onPress={onClose}>
            <Text style={styles.validateButtonText}>Valider</Text>
          </TouchableOpacity>
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

  difficultyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: iOS.spacing.compact,
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: iOS.spacing.standard,
    marginBottom: iOS.spacing.compact,
    minHeight: 44,
  },

  difficultyOptionSelected: {
    backgroundColor: iOS.colors.systemGray6,
  },

  emoji: {
    fontSize: 24,
  },

  difficultyLabel: {
    ...iOS.typography.body,
    color: iOS.colors.label,
  },

  validateButton: {
    backgroundColor: iOS.colors.tint,
    borderRadius: 10,
    padding: iOS.spacing.standard,
    marginTop: iOS.spacing.standard,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  validateButtonText: {
    ...iOS.typography.headline,
    color: iOS.colors.systemBackground,
  },
});
