import iOS from '@/styles/ios';
import { Recipe } from '@/types/Recipe';
import { getRecipeEmoji, getRelativeTime } from '@/utils';
import { ChevronRight, Trash2, Flag } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue
} from 'react-native-reanimated';

interface RecipeRowProps {
  recipe: Recipe;
  onPress: () => void;
  onDelete: () => void;
}

const RecipeRow: React.FC<RecipeRowProps> = ({ recipe, onPress, onDelete }) => {
  const emoji = useMemo(() => getRecipeEmoji(recipe.title), [recipe.title]);
  const relativeTime = useMemo(() => getRelativeTime(recipe.createdAt), [recipe.createdAt]);

  const renderRightActions = (progress: SharedValue<number>, drag: SharedValue<number>) => {
    const deleteAnimatedStyle = useAnimatedStyle(() => {
      const translateX = interpolate(
        drag.value,
        [-150, -75, 0],
        [0, 0, 75],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ translateX }],
      };
    });

    const flagAnimatedStyle = useAnimatedStyle(() => {
      const translateX = interpolate(
        drag.value,
        [-150, -75, 0],
        [0, 0, 150],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ translateX }],
      };
    });

    return (
      <View style={styles.actionsContainer}>
        <Animated.View style={[styles.actionButton, styles.flagButton, flagAnimatedStyle]}>
          <TouchableOpacity
            style={styles.actionTouchable}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Flag size={20} color="#fff" fill="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.actionButton, styles.deleteButton, deleteAnimatedStyle]}>
          <TouchableOpacity
            style={styles.actionTouchable}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
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
        style={styles.rowContainer}
        onPress={onPress}
        activeOpacity={0.98}
      >
        <View style={styles.row}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.title} numberOfLines={1}>
                {recipe.title || 'Untitled Recipe'}
              </Text>
              <Text style={styles.time}>{relativeTime}</Text>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}
                </Text>
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

const styles = StyleSheet.create({
  rowContainer: {
    backgroundColor: iOS.colors.systemBackground,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: iOS.colors.systemBackground,
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
  time: {
    fontSize: 15,
    color: iOS.colors.secondaryLabel,
    fontWeight: '400',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    height: '100%',
  },
  actionButton: {
    width: 75,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagButton: {
    backgroundColor: iOS.colors.systemOrange,
  },
  deleteButton: {
    backgroundColor: iOS.colors.systemRed,
  },
})

export default RecipeRow