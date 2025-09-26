import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { HomeScreen } from '@/screens/HomeScreen';
import { AddRecipeScreen } from '@/screens/AddRecipeScreen';
import { RecipeDetailScreen } from '@/screens/RecipeDetailScreen';
import { TranslationPreviewScreen } from '@/screens/TranslationPreviewScreen';
import { theme } from '@/styles/theme';
import { RootStackParamList } from '@/types/mobile-utils';

const AppStack = createStackNavigator<RootStackParamList>();

function AppNavigation() {
  return (
      <AppStack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { 
            backgroundColor: theme.colors.primary,
            height: 100,
          },
          headerTintColor: theme.colors.background,
          headerTitleStyle: { 
            fontSize: 20, 
            fontWeight: 'bold' 
          },
        }}
      >
        <AppStack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: '📚 Mes Recettes' }} 
        />
        <AppStack.Screen 
          name="AddRecipe" 
          component={AddRecipeScreen} 
          options={{ title: '✍️ Ajouter Recette' }} 
        />
        <AppStack.Screen 
          name="RecipeDetail" 
          component={RecipeDetailScreen} 
          options={{ title: '📖 Détails' }} 
        />
        <AppStack.Screen 
          name="TranslationPreview" 
          component={TranslationPreviewScreen} 
          options={{ title: '🌍 Aperçu Traduction' }} 
        />
      </AppStack.Navigator>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <AppNavigation />
      <StatusBar style="light" backgroundColor={theme.colors.primary} />
    </>
  );
}