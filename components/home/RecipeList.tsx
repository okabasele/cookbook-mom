import { Recipe } from '@/types/Recipe';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import EmptyState from './EmptyState';
import RecipeRow from './RecipeRow';
import iOS from '@/styles/ios';
import { customObjectGroupBy } from '@/utils';

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

const RecipeList = ({
  recipes,
  searchQuery,
  handleDeleteRecipe,
  toRecipeDetail,
}: RecipeListProps) => {
    const sortedRecipes = [...recipes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredRecipe = customObjectGroupBy<Recipe, string>(
    sortedRecipes,
    (recipe) => {
      const createdAt = new Date(recipe.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdAt.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'today';
      if (diffDays === 1) return 'yesterday';
      if (diffDays <= 7) return 'last7days';
      if (diffDays <= 30) return 'last30days';
      return 'older';
    }
  );
  const renderItem = useCallback(
    ({ item, index, totalItems }: { item: Recipe; index: number; totalItems: number }) => (
      <RecipeRow
        key={item.id}
        recipe={item}
        onPress={() => toRecipeDetail(item.id)}
        onDelete={() => handleDeleteRecipe(item.id)}
        showDivider={index !== totalItems - 1}
      />
    ),
    []
  );

  const keyExtractor = useCallback((item: Recipe) => item.id, []);

  return (
    <View style={styles.container}>
      {recipes.length === 0 && !searchQuery && (
        <View style={styles.listSection}>
          <EmptyState />
        </View>
      )}
      {recipes.length === 0 && searchQuery && (
        <View style={styles.listSection}>
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={styles.noResultsText}>
              Aucun résultat pour "{searchQuery}"
            </Text>
          </View>
        </View>
      )}

      {Object.entries(filteredRecipe).map(([section, recipesInSection]) => (
        <View key={section}>
          {recipesInSection.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>
                {sectionsTitleMap[section]}
              </Text>
              <View style={styles.listSection}>
                <FlatList
                  data={recipesInSection}
                  renderItem={({ item, index }) =>
                    renderItem({
                      item,
                      index,
                      totalItems: recipesInSection.length,
                    })
                  }
                  keyExtractor={keyExtractor}
                  scrollEnabled={false}
                />
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: iOS.spacing.standard,
  },
  listSection: {
    marginTop: iOS.spacing.standard,
    backgroundColor: iOS.colors.systemBackground,
    borderRadius: 10,
    marginHorizontal: iOS.spacing.standard,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...iOS.typography.headline,
    color: iOS.colors.label,
  },
  noResultsContainer: {
    padding: 48,
    alignItems: 'center',
  },
  noResultsIcon: {
    fontSize: 56,
    marginBottom: iOS.spacing.standard,
  },
  noResultsText: {
    ...iOS.typography.body,
    color: iOS.colors.secondaryLabel,
  },
});

export default RecipeList;
