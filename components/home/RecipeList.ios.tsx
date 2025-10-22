import { Host, VStack, Text } from '@expo/ui/swift-ui';
import { padding, foregroundStyle, frame, background, clipShape } from '@expo/ui/swift-ui/modifiers';
import { Recipe } from '@/types/Recipe';
import { customObjectGroupBy } from '@/utils';
import RecipeRow from './RecipeRow.ios';
import EmptyState from './EmptyState';
import React, { useMemo } from 'react';

type RecipeListProps = {
  recipes: Recipe[];
  searchQuery?: string;
  handleDeleteRecipe: (id: string) => void;
  toRecipeDetail: (id: string) => void;
  onAddRecipe?: () => void;
};

const sectionsTitleMap: Record<string, string> = {
  today: "Aujourd'hui",
  yesterday: 'Hier',
  last7days: 'Derniers 7 jours',
  last30days: 'Derniers 30 jours',
  older: 'Plus ancien',
};

/**
 * RecipeList component migrated to SwiftUI
 *
 * Features:
 * - Grouped list with date-based sections (Today, Yesterday, etc.)
 * - Empty state when no recipes
 * - Search results "no results" state
 * - Uses native SwiftUI VStack for layout
 * - Uses RecipeRow.ios.tsx for individual rows
 *
 * Migration notes:
 * - View + FlatList -> VStack (SwiftUI handles scrolling automatically)
 * - StyleSheet -> SwiftUI modifiers
 * - Section headers with custom Text + VStack
 * - Delete handled at RecipeRow level
 * - Dark mode automatic via semantic colors
 *
 * Known limitations:
 * - No ScrollView wrapper (not available in @expo/ui/swift-ui yet)
 * - VStack should scroll automatically when content overflows
 */
export default function RecipeList({
  recipes,
  searchQuery,
  handleDeleteRecipe,
  toRecipeDetail,
}: RecipeListProps) {

  // Group recipes by date sections
  const filteredRecipe = useMemo(() =>
    customObjectGroupBy<Recipe, string>(recipes, (recipe) => {
      const createdAt = new Date(recipe.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdAt.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'today';
      if (diffDays === 1) return 'yesterday';
      if (diffDays <= 7) return 'last7days';
      if (diffDays <= 30) return 'last30days';
      return 'older';
    }),
    [recipes]
  );

  // Show empty state when no recipes and no search
  if (recipes.length === 0 && !searchQuery) {
    return (
      <Host style={{ flex: 1 }}>
        <VStack
          modifiers={[
            padding({ all: 16 }),
            frame({ maxWidth: Infinity }),
          ]}
        >
          <EmptyState />
        </VStack>
      </Host>
    );
  }

  // Show "no results" state when searching with no results
  if (recipes.length === 0 && searchQuery) {
    return (
      <Host style={{ flex: 1 }}>
        <VStack
          spacing={16}
          modifiers={[
            padding({ all: 48 }),
            background('#FFFFFF'),
            clipShape('roundedRectangle', 10),
            frame({ maxWidth: Infinity }),
          ]}
        >
          <Text>🔍</Text>
          <Text
            modifiers={[
              foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
            ]}
          >
            {`Aucun résultat pour "${searchQuery}"`}
          </Text>
        </VStack>
      </Host>
    );
  }

  // Render grouped recipe list
  return (
    <Host style={{ flex: 1 }}>
      <VStack
        spacing={16}
        modifiers={[
          padding({ vertical: 16 }),
        ]}
      >
        {Object.entries(filteredRecipe).map(([section, recipesInSection]) => {
          if (recipesInSection.length === 0) return null;

          return (
            <VStack
              key={section}
              spacing={8}
              modifiers={[
                frame({ maxWidth: Infinity }),
              ]}
            >
              {/* Section Title */}
              <Text
                modifiers={[
                  foregroundStyle({ type: 'hierarchical', style: 'primary' }),
                  padding({ horizontal: 16 }),
                ]}
              >
                {sectionsTitleMap[section]}
              </Text>

              {/* Section Content - Rounded Container */}
              <VStack
                spacing={0}
                modifiers={[
                  background('#FFFFFF'),
                  clipShape('roundedRectangle', 10),
                  padding({ horizontal: 16 }),
                ]}
              >
                {recipesInSection.map((recipe, index) => (
                  <RecipeRow
                    key={recipe.id}
                    recipe={recipe}
                    onPress={() => toRecipeDetail(recipe.id)}
                    onDelete={() => handleDeleteRecipe(recipe.id)}
                    showDivider={index !== recipesInSection.length - 1}
                  />
                ))}
              </VStack>
            </VStack>
          );
        })}
      </VStack>
    </Host>
  );
}
