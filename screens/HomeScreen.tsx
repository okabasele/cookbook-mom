import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Recipe } from '../types/Recipe';
import { getAllRecipes } from '../utils/storage';
import { theme, commonStyles } from '../styles/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/mobile-utils';

type Props = StackScreenProps<RootStackParamList, 'Home'>;


export function HomeScreen({ navigation }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const allRecipes = await getAllRecipes();
      setRecipes(allRecipes);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les recettes');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [])
  );

  // Group recipes by families (show only originals)
  const recipeFamilies = recipes.filter(r => r.isOriginal);

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
      activeOpacity={0.7}
    >
      <Text style={styles.recipeTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.languageRow}>
        <Text style={styles.languageFlag}>
          {item.detectedLanguage === 'en' ? '🇺🇸' : '🇫🇷'}
        </Text>
        <Text style={styles.languageText}>
          {item.detectedLanguage === 'en' ? 'English' : 'Français'}
        </Text>
        {item.translationIds.length > 0 && (
          <View style={styles.translationBadge}>
            <Text style={styles.badgeText}>
              +{item.translationIds.length} traduction{item.translationIds.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.dateText}>
        Ajouté le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={commonStyles.loading}>
        <Text style={commonStyles.loadingText}>Chargement des recettes...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <FlatList
        data={recipeFamilies}
        renderItem={renderRecipeCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={commonStyles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={commonStyles.emptyTitle}>
              Aucune recette pour le moment
            </Text>
            <Text style={commonStyles.emptySubtitle}>
              Ajoutez votre première recette pour commencer à créer votre collection de recettes multilingues!
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddRecipe')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>➕ Ajouter Recette</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: theme.spacing.md,
    paddingBottom: 100, // Space for FAB
  },
  
  recipeCard: {
    ...commonStyles.card,
    marginBottom: theme.spacing.md,
  },
  
  recipeTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  languageFlag: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  
  languageText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  
  translationBadge: {
    backgroundColor: theme.colors.blue100,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.lg,
  },
  
  badgeText: {
    ...theme.typography.captionSmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  
  dateText: {
    ...theme.typography.captionSmall,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  
  fabText: {
    color: theme.colors.background,
    ...theme.typography.button,
    fontWeight: 'bold',
  },
  
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
});