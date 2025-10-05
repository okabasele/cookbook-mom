import { Recipe } from '@/types/Recipe'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import EmptyState from './EmptyState'
import RecipeRow from './RecipeRow'
import iOS from '@/styles/ios'

type RecipeListProps = {
  recipes: Recipe[];
  searchQuery?: string;
  handleDeleteRecipe: (id: string) => void;
  toRecipeDetail: (id: string) => void;
  onAddRecipe?: () => void;
}
const RecipeList = ({recipes, searchQuery, handleDeleteRecipe, toRecipeDetail}: RecipeListProps) => {
  return (
          <View style={styles.listSection}>
            {recipes.length === 0 && !searchQuery && (
              <EmptyState />
            )}
            {recipes.length === 0 && searchQuery && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsIcon}>🔍</Text>
                <Text style={styles.noResultsText}>
                  Aucun résultat pour "{searchQuery}"
                </Text>
              </View>
            )}

            {recipes.map((recipe, index) => (
              <RecipeRow
                key={recipe.id}
                recipe={recipe}
                onPress={() => toRecipeDetail(recipe.id)}
                onDelete={() => handleDeleteRecipe(recipe.id)}
               showDivider={index !== recipes.length - 1}
              />
            ))}
          </View>
  )
}

const styles = StyleSheet.create({
    listSection: {
    marginTop: iOS.spacing.standard,
    backgroundColor: iOS.colors.systemBackground,
    borderRadius: 10,
    marginHorizontal: iOS.spacing.standard,
    overflow: 'hidden',
  },
    // No Results
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
})

export default RecipeList