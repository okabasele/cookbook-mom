import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
import { Recipe } from '../types/Recipe';
import { getAllRecipes, deleteRecipe } from '../utils/storage';
import iOS from '@/styles/ios';
import { ButtonAddRecipe } from '@/components/ButtonAddRecipe';
import { SearchBarProps } from 'react-native-screens';
import RecipeList from '@/components/home/RecipeList';

// ===========================
// 🏠 MAIN HOME SCREEN
// ===========================
export function HomeScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Rechercher une recette',
        onChangeText: (event) => {
          setSearchQuery(event.nativeEvent.text);
        },
      } as SearchBarProps,
      headerRight: () => (
        <ButtonAddRecipe onPress={() => router.push('/(tabs)/add-recipe')} />
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
  const recipeFamilies = recipes.filter((r) => r.isOriginal);
  const filteredRecipes = useMemo(
    () =>
      recipeFamilies.filter((r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
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
  const handleToRecipeDetail = (recipeId: string) => {
    router.push(`/recipe-detail/${recipeId}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement des recettes...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.main}
    >
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
         <RecipeList recipes={filteredRecipes} searchQuery={searchQuery} handleDeleteRecipe={handleDeleteRecipe} toRecipeDetail={handleToRecipeDetail} />
        </Animated.ScrollView>
      </View>
    </ScrollView>
  );
}

// ===========================
// 🎨 STYLES
// ===========================
const styles = StyleSheet.create({
  main:{
    padding:16,
  },
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

  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
