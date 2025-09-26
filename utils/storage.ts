import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types/Recipe';

const RECIPES_KEY = 'recipes';

export const saveRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    const recipes = await getAllRecipes();
    const existingIndex = recipes.findIndex(r => r.id === recipe.id);
    
    if (existingIndex >= 0) {
      recipes[existingIndex] = recipe;
    } else {
      recipes.push(recipe);
    }
    
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw new Error('Impossible de sauvegarder la recette');
  }
};

export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    const data = await AsyncStorage.getItem(RECIPES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading recipes:', error);
    return [];
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const recipes = await getAllRecipes();
    return recipes.find(recipe => recipe.id === id) || null;
  } catch (error) {
    console.error('Error loading recipe:', error);
    return null;
  }
};

export const getRecipeFamily = async (recipeId: string): Promise<Recipe[]> => {
  try {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) return [];

    const recipes = await getAllRecipes();
    
    if (recipe.isOriginal) {
      // Get original + all translations
      const translations = recipes.filter(r => recipe.translationIds.includes(r.id));
      return [recipe, ...translations];
    } else {
      // Get original + all its translations
      const original = recipes.find(r => r.id === recipe.originalRecipeId);
      if (!original) return [recipe];
      
      const translations = recipes.filter(r => original.translationIds.includes(r.id));
      return [original, ...translations];
    }
  } catch (error) {
    console.error('Error loading recipe family:', error);
    return [];
  }
};

export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    const recipes = await getAllRecipes();
    const recipe = recipes.find(r => r.id === id);
    
    if (!recipe) return;
    
    // Handle deletion based on recipe type
    if (recipe.isOriginal && recipe.translationIds.length > 0) {
      // If deleting original with translations, promote first translation to original
      const firstTranslationId = recipe.translationIds[0];
      const firstTranslation = recipes.find(r => r.id === firstTranslationId);
      
      if (firstTranslation) {
        firstTranslation.isOriginal = true;
        firstTranslation.originalRecipeId = undefined;
        firstTranslation.translationIds = recipe.translationIds.slice(1);
        
        // Update other translations to point to new original
        recipe.translationIds.slice(1).forEach(translationId => {
          const translation = recipes.find(r => r.id === translationId);
          if (translation) {
            translation.originalRecipeId = firstTranslationId;
          }
        });
      }
    } else if (!recipe.isOriginal && recipe.originalRecipeId) {
      // Remove this translation from original's translation list
      const original = recipes.find(r => r.id === recipe.originalRecipeId);
      if (original) {
        original.translationIds = original.translationIds.filter(id => id !== recipe.id);
      }
    }
    
    // Remove the recipe
    const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(filteredRecipes));
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw new Error('Impossible de supprimer la recette');
  }
};

export const updateRecipeTranslationIds = async (originalId: string, translationId: string): Promise<void> => {
  try {
    const recipes = await getAllRecipes();
    const original = recipes.find(r => r.id === originalId);
    
    if (original && !original.translationIds.includes(translationId)) {
      original.translationIds.push(translationId);
      await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    }
  } catch (error) {
    console.error('Error updating translation IDs:', error);
  }
};