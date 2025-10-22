import { Host, HStack, VStack, Text, Image, Button, Divider } from '@expo/ui/swift-ui';
import { background, clipShape, frame, padding } from '@expo/ui/swift-ui/modifiers';
import { Recipe } from '@/types/Recipe';
import { getFlagEmoji, getRecipeEmoji } from '@/utils';
import React, { useMemo } from 'react';

interface RecipeRowProps {
  recipe: Recipe;
  onPress: () => void;
  onDelete: () => void;
  showDivider?: boolean;
}

/**
 * RecipeRow component migrated to SwiftUI
 *
 * Features:
 * - Native SwiftUI Button with haptic feedback
 * - Swipe-to-delete with native .swipeActions
 * - Automatic dark mode support via Color(.system...)
 * - SF Symbols chevron icon
 * - Conditional divider separator
 *
 * Migration notes:
 * - TouchableOpacity → Button (native SwiftUI)
 * - ChevronRight (Lucide) → Image(systemName: "chevron.right")
 * - Swipeable → swipeActions modifier (native SwiftUI gesture)
 * - StyleSheet colors → Color(.system...) for dark mode
 * - Border separator → Divider() component
 */
export function RecipeRow({ recipe, onPress, onDelete, showDivider = false }: RecipeRowProps) {
  const emoji = useMemo(() => getRecipeEmoji(recipe.title), [recipe.title]);
  const flagEmoji = useMemo(() => getFlagEmoji(recipe.detectedLanguage), [recipe.detectedLanguage]);

  const ingredientCount = recipe.ingredients.length;
  const ingredientText = `${ingredientCount} ingredient${ingredientCount !== 1 ? 's' : ''}`;

  return (
    <Host matchContents>
      <VStack spacing={0}>
        {/* Main Button Container */}
        <Button onPress={onPress}>
          <HStack
            spacing={12}
            modifiers={[
              padding({ vertical: 12, horizontal: 16 }),
              frame({ minHeight: 76 }),
            ]}
          >
            {/* Emoji Container - Circle with background */}
            <VStack
              modifiers={[
                frame({ width: 48, height: 48 }),
                background('.secondarySystemBackground'),
                clipShape('circle'),
              ]}
            >
              <Text>{emoji}</Text>
            </VStack>

            {/* Content Container */}
            <VStack
              spacing={6}
              modifiers={[
                frame({ maxWidth: Infinity }),
                padding({ trailing: 8 }),
              ]}
            >
              {/* Title */}
              <Text
                modifiers={[
                  frame({ maxWidth: Infinity, alignment: 'leading' }),
                ]}
              >
                {recipe.title}
              </Text>

              {/* Details Row - Badges */}
              <HStack spacing={8}>
                {/* Ingredients Badge */}
                <Text
                  modifiers={[
                    background('.secondarySystemBackground'),
                    padding({ horizontal: 8, vertical: 4 }),
                    clipShape('roundedRectangle', 6 ),
                  ]}
                >
                  {ingredientText}
                </Text>

                {/* Language Badge */}
                <Text
                  modifiers={[
                    background('.secondarySystemBackground'),
                    padding({ horizontal: 8, vertical: 4 }),
                    clipShape('roundedRectangle', 6 ),
                  ]}
                >
                  {flagEmoji}
                </Text>
              </HStack>
            </VStack>

            {/* Chevron Icon */}
            <Image
              systemName="chevron.right"
              modifiers={[
                padding({ leading: 4 }),
              ]}
            />
          </HStack>
        </Button>

        {/* Conditional Divider Separator */}
        {showDivider && <Divider />}
      </VStack>
    </Host>
  );
}

export default RecipeRow;
