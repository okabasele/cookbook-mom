import iOS from '@/styles/ios';
import { Recipe } from '@/types/Recipe';
import { getRecipeEmoji, getRelativeTime } from '@/utils';
import { ChevronRight, Trash2, View } from 'lucide-react-native';
import React, { useMemo } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

// ===========================
// 🧩 RECIPE ROW COMPONENT
// ===========================
interface RecipeRowProps {
  recipe: Recipe;
  onPress: () => void;
  onDelete: () => void;
}

const RecipeRow: React.FC<RecipeRowProps> = ({ recipe, onPress, onDelete }) => {
  const emoji = useMemo(() => getRecipeEmoji(recipe.title), [recipe.title]);
  const relativeTime = useMemo(() => getRelativeTime(recipe.createdAt), [recipe.createdAt]);

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={onDelete}
      activeOpacity={0.7}
    >
      <Trash2 size={22} color={iOS.colors.systemBackground} />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={styles.recipeRow}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Emoji Icon */}
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>

        {/* Content */}
        <View style={styles.recipeContent}>
          {/* Title */}
          <Text style={styles.recipeRowTitle} numberOfLines={1}>
            {recipe.title}
          </Text>

          {/* Metadata */}
          <View style={styles.metadataRow}>
            <View style={styles.flagsContainer}>
              <Text>{recipe.detectedLanguage === 'fr' ? '🇫🇷' : '🇺🇸'}</Text>
              {recipe.translationIds.length > 0 && (
                <Text>{recipe.detectedLanguage === 'fr' ? '🇺🇸' : '🇫🇷'}</Text>
              )}
            </View>
            <Text style={styles.metadataText}>•</Text>
            <Text style={styles.metadataText}>{recipe.ingredients.length} ingr.</Text>
            <Text style={styles.metadataText}>•</Text>
            <Text style={styles.metadataText}>{relativeTime}</Text>
          </View>
        </View>

        {/* Chevron */}
        <ChevronRight size={20} color={iOS.colors.tertiaryLabel} />
      </TouchableOpacity>

      {/* Separator */}
      <View style={styles.separator} />
    </Swipeable>
  );
};
// ===========================
// 🎨 STYLES
// ===========================
const styles = StyleSheet.create({
    // Recipe Row
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: iOS.spacing.standard,
    backgroundColor: iOS.colors.systemBackground,
  },
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: iOS.colors.systemGray6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 32,
  },
  recipeContent: {
    flex: 1,
  },
  recipeRowTitle: {
    ...iOS.typography.body,
    fontWeight: '600',
    color: iOS.colors.label,
    marginBottom: 2,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flagsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  metadataText: {
    ...iOS.typography.subheadline,
    color: iOS.colors.secondaryLabel,
  },
  separator: {
    height: 0.5,
    backgroundColor: iOS.colors.separator,
    marginLeft: 88,
  },

  // Delete Button
  deleteButton: {
    backgroundColor: iOS.colors.systemRed,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
});

export default RecipeRow