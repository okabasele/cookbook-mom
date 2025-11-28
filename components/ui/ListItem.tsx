import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { X } from 'lucide-react-native';
import iOS from '@/styles/ios';

interface ListItemProps {
  item: string;
  number?: number; // Optional for numbered items like steps
  onUpdate: (item: string) => void;
  onDelete: () => void;
}

export function ListItem({
  item,
  number,
  onUpdate,
  onDelete,
}: ListItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {number !== undefined && <Text style={styles.number}>{number}.</Text>}
        <View style={styles.inputContainer}>
          <TextInput
            value={item}
            onChangeText={onUpdate}
            style={styles.input}
            placeholderTextColor={iOS.colors.tertiaryLabel}
            multiline={number !== undefined} // Multiline for steps
          />
        </View>
        <TouchableOpacity
          onPress={onDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={20} color={iOS.colors.systemGray} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: iOS.colors.systemBackground,
    borderBottomWidth: 0.5,
    borderBottomColor: iOS.colors.separator,
    paddingHorizontal: iOS.spacing.standard,
    paddingVertical: 12,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: iOS.spacing.compact,
  },

  number: {
    ...iOS.typography.body,
    color: iOS.colors.secondaryLabel,
    fontWeight: '600',
    minWidth: 24,
  },

  inputContainer: {
    flex: 1,
  },

  input: {
    ...iOS.typography.body,
    color: iOS.colors.label,
    padding: 0,
    marginBottom: 2,
  },

  originalText: {
    ...iOS.typography.caption1,
    color: iOS.colors.tertiaryLabel,
  },

  deleteButton: {
    padding: iOS.spacing.compact,
  },
});