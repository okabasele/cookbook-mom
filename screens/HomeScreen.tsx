import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
  TextInput,
} from 'react-native';
import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
import { Search } from 'lucide-react-native';
import { Recipe } from '../types/Recipe';
import { getAllRecipes, deleteRecipe } from '../utils/storage';
import iOS from '@/styles/ios';
import RecipeRow from '@/components/RecipeRow';
import { ButtonAddRecipe } from '@/components/ButtonAddRecipe';

// ===========================
// 🧩 EMPTY STATE
// ===========================
const EmptyState: React.FC<{ onAddRecipe: () => void }> = ({ onAddRecipe }) => (
  <View style={styles.emptyStateContainer}>
    <Text style={styles.emptyIcon}>🧑‍🍳</Text>
    <Text style={styles.emptyTitle}>Aucune recette</Text>
    <Text style={styles.emptySubtitle}>
      Commencez par ajouter votre première recette familiale
    </Text>
  </View>
);

// ===========================
// 🏠 MAIN HOME SCREEN
// ===========================
export function HomeScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <ButtonAddRecipe onPress={()=>router.push('/(tabs)/add-recipe')}/>
      ),
    });
  }, [navigation]);
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

  // Filter recipes
  const recipeFamilies = recipes.filter(r => r.isOriginal);
  const filteredRecipes = useMemo(
    () => recipeFamilies.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [recipeFamilies, searchQuery]
  );

  const handleDeleteRecipe = async (recipeId: string) => {
    Alert.alert(
      'Supprimer la recette',
      'Voulez-vous vraiment supprimer cette recette ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(recipeId);
              await loadRecipes();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer la recette');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement des recettes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar Area */}
        <View style={styles.searchBarContainer}>

          {/* Search Bar */}
          <View style={[
            styles.searchBar,
            searchFocused && styles.searchBarFocused
          ]}>
            <Search size={16} color={iOS.colors.secondaryLabel} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher"
              placeholderTextColor={iOS.colors.secondaryLabel}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </View>
        </View>

        {/* List Section */}
        <View style={styles.listSection}>
          {filteredRecipes.length === 0 && !searchQuery && (
            <EmptyState onAddRecipe={() => router.push('/(tabs)/add-recipe')} />
          )}

          {filteredRecipes.length === 0 && searchQuery && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsIcon}>🔍</Text>
              <Text style={styles.noResultsText}>
                Aucun résultat pour "{searchQuery}"
              </Text>
            </View>
          )}

          {filteredRecipes.map((recipe) => (
            <RecipeRow
              key={recipe.id}
              recipe={recipe}
              onPress={() => router.push(`/recipe-detail/${recipe.id}`)}
              onDelete={() => handleDeleteRecipe(recipe.id)}
            />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// ===========================
// 🎨 STYLES
// ===========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOS.colors.groupedBackground,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: iOS.colors.systemBackground,
  },
  loadingText: {
    ...iOS.typography.title2,
    color: iOS.colors.tint,
  },

  // Scrollable Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },

  // Search Bar
    searchBarContainer: {
    paddingTop: iOS.spacing.statusBar + iOS.spacing.navBar,
    paddingHorizontal: iOS.spacing.standard,
    paddingBottom: iOS.spacing.compact,
    backgroundColor: iOS.colors.groupedBackground,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: iOS.colors.systemFill,
    borderRadius: 10,
    paddingHorizontal: iOS.spacing.compact,
    height: 36,
  },
  searchBarFocused: {
    backgroundColor: iOS.colors.tertiarySystemFill,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    ...iOS.typography.body,
    color: iOS.colors.label,
    height: 36,
  },

  // List Section
  listSection: {
    marginTop: iOS.spacing.standard,
    backgroundColor: iOS.colors.systemBackground,
    borderRadius: 10,
    marginHorizontal: iOS.spacing.standard,
    overflow: 'hidden',
  },

  // Empty State
  emptyStateContainer: {
    padding: 64,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: iOS.spacing.standard * 2,
  },
  emptyTitle: {
    ...iOS.typography.title2,
    color: iOS.colors.label,
    marginBottom: iOS.spacing.compact,
  },
  emptySubtitle: {
    ...iOS.typography.body,
    color: iOS.colors.secondaryLabel,
    textAlign: 'center',
    maxWidth: 280,
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
});