import iOS from '@/styles/ios';
import { Recipe } from '@/types/Recipe';
import { getFlagEmoji, getRecipeEmoji } from '@/utils';
import { ChevronRight } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import ActionButton from '../ui/ActionButton';

interface RecipeRowProps {
  recipe: Recipe;
  onPress: () => void;
  onDelete: () => void;
  showDivider?: boolean;
}

const RecipeRow: React.FC<RecipeRowProps> = ({ recipe, onPress, onDelete, showDivider }) => {
  const emoji = useMemo(() => getRecipeEmoji(recipe.title), [recipe.title]);

// Dans RecipeRow.tsx
const handlePress = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  onPress();
};

const handleDelete = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  onDelete();
};
  const renderRightActions = (
    progress: SharedValue<number>,
    drag: SharedValue<number>
  ) => {
    const deleteAnimatedStyle = useAnimatedStyle(() => {
      const translateX = drag.value + 80;

      return {
        transform: [{ translateX }],
      };
    });

    return (
      <View style={styles.actionsContainer}>
        <ActionButton
          type="delete"
          animatedStyle={deleteAnimatedStyle}
          onPress={handleDelete}
          actionText="Effacer"
        />
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.98}
      >
        <View style={showDivider ? styles.rowWithDivider : styles.row}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.title} numberOfLines={1}>
                {recipe.title}
              </Text>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {recipe.ingredients.length} ingredient
                  {recipe.ingredients.length !== 1 ? 's' : ''}
                </Text>
              </View>
                <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {getFlagEmoji(recipe.detectedLanguage)}</Text>
                </View>
            </View>
          </View>

          <ChevronRight
            size={18}
            color={iOS.colors.tertiaryLabel}
            style={styles.chevron}
          />
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default React.memo(RecipeRow, (prevProps, nextProps) => {
  return prevProps.recipe.id === nextProps.recipe.id &&
         prevProps.recipe.title === nextProps.recipe.title;
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 76,
  },
    rowWithDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: iOS.colors.separator,
    minHeight: 76,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: iOS.colors.secondarySystemBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 28,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: iOS.colors.label,
    flex: 1,
    marginRight: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: iOS.colors.secondarySystemBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 13,
    color: iOS.colors.secondaryLabel,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    backgroundColor: 'transparent',
  },
});
