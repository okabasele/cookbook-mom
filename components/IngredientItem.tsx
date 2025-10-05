import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import iOS from '../styles/ios';
import { Text } from 'react-native';

interface ConvertedItem {
  converted: string;
  original: string;
}

interface IngredientItemProps {
  ingredient: ConvertedItem;
  onUpdate: (ingredient: ConvertedItem) => void;
  onDelete: () => void;
}

export function IngredientItem({ ingredient, onUpdate, onDelete }: IngredientItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            value={ingredient.converted}
            onChangeText={(text) => onUpdate({ ...ingredient, converted: text })}
            style={styles.input}
            placeholderTextColor={iOS.colors.tertiaryLabel}
          />
          {ingredient.original !== ingredient.converted && (
            <Text style={styles.originalText}>
              ({ingredient.original})
            </Text>
          )}
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
    alignItems: 'flex-start',
    gap: iOS.spacing.compact,
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
