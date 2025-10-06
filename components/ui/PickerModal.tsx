import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import iOS from '@/styles/ios';

interface PickerOption {
  value: string;
  label: string;
  icon?: string; // Emoji or flag
}

interface PickerModalProps {
  visible: boolean;
  options: PickerOption[];
  value: string;
  title: string;
  onChange: (selectedValue: string) => void;
  onClose: () => void;
  showValidateButton?: boolean;
}

function PickerModal({
  visible,
  options,
  value,
  title,
  onChange,
  onClose,
  showValidateButton = false,
}: PickerModalProps) {
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
            <Text style={styles.headerText}>{title}</Text>
          </View>

          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                onChange(option.value);
                if (!showValidateButton) onClose(); // Close immediately if no validate button
              }}
              style={[
                styles.option,
                value === option.value && styles.optionSelected,
              ]}
            >
              <View style={styles.optionContent}>
                {option.icon && <Text style={styles.icon}>{option.icon}</Text>}
                <Text style={styles.optionLabel}>{option.label}</Text>
              </View>
              {value === option.value && (
                <Text style={styles.checkIcon}>✔️</Text>
              )}
            </TouchableOpacity>
          ))}

          {showValidateButton && (
            <TouchableOpacity style={styles.validateButton} onPress={onClose}>
              <Text style={styles.validateButtonText}>Valider</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default PickerModal;

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

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: iOS.spacing.standard,
    marginBottom: iOS.spacing.compact,
    minHeight: 44,
  },

  optionSelected: {
    backgroundColor: iOS.colors.systemGray6,
  },

  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: iOS.spacing.compact,
  },

  icon: {
    fontSize: 24,
  },

  optionLabel: {
    ...iOS.typography.body,
    color: iOS.colors.label,
  },

  checkIcon: {
    fontSize: 20,
    color: iOS.colors.tint,
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