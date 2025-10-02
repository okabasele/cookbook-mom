import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Search, Plus, ChevronRight, Trash2 } from 'lucide-react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Recipe } from '../types/Recipe';
import { getAllRecipes, deleteRecipe } from '../utils/storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/mobile-utils';
import iOS from '@/styles/ios';
type Props = StackScreenProps<RootStackParamList, 'Home'>;


// ===========================
// 🍽️ UTILITY FUNCTIONS
// ===========================
const getRecipeEmoji = (title: string): string => {
  const map: { [key: string]: string } = {
    cookie: '🍪', cake: '🍰', bread: '🥖', pasta: '🍝', soup: '🍲',
    salad: '🥗', pizza: '🍕', burger: '🍔', croissant: '🥐', cupcake: '🧁', default: '🍽️'
  };
  const key = Object.keys(map).find(k => title.toLowerCase().includes(k)) || 'default';
  return map[key];
};

const getRelativeTime = (date: string): string => {
  const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days}j`;
  return `Il y a ${Math.floor(days / 7)}sem`;
};

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
export function HomeScreen({ navigation }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

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

  // Navigation bar animations
  const navBarProgress = scrollY.interpolate({
    inputRange: [0, 52],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const largeTitleOpacity = scrollY.interpolate({
    inputRange: [0, 26],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const smallTitleOpacity = scrollY.interpolate({
    inputRange: [0, 52],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const navBarBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 52],
    outputRange: [0.8, 1],
    extrapolate: 'clamp',
  });

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
        {/* Large Title Area */}
        <View style={styles.largeTitleContainer}>

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
            <EmptyState onAddRecipe={() => navigation.navigate('AddRecipe')} />
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
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
              onDelete={() => handleDeleteRecipe(recipe.id)}
            />
          ))}
        </View>
      </Animated.ScrollView>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
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

  // Navigation Bar
  navBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  navBarBlur: {
    borderBottomWidth: 0.5,
    borderBottomColor: iOS.colors.separator,
  },
  statusBar: {
    height: iOS.spacing.statusBar,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: iOS.spacing.standard,
  },
  statusBarText: {
    ...iOS.typography.caption1,
    color: iOS.colors.label,
  },
  navBar: {
    height: iOS.spacing.navBar,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: iOS.spacing.standard,
  },
  navBarTitle: {
    ...iOS.typography.headline,
    color: iOS.colors.label,
  },
  addButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scrollable Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },

  // Large Title
  largeTitleContainer: {
    paddingTop: iOS.spacing.statusBar + iOS.spacing.navBar,
    paddingHorizontal: iOS.spacing.standard,
    paddingBottom: iOS.spacing.compact,
    backgroundColor: iOS.colors.groupedBackground,
  },
  largeTitle: {
    ...iOS.typography.largeTitle,
    color: iOS.colors.label,
    marginBottom: iOS.spacing.standard,
  },

  // Search Bar
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

  // Home Indicator
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    width: 134,
    height: 5,
    backgroundColor: iOS.colors.label,
    borderRadius: 100,
    opacity: 0.3,
    transform: [{ translateX: -67 }],
  },
});