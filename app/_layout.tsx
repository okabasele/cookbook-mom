import { createStackNavigator } from '@react-navigation/stack';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { HomeScreen } from '@/screens/HomeScreen';
import { AddRecipeScreen } from '@/screens/AddRecipeScreen';
import { RecipeDetailScreen } from '@/screens/RecipeDetailScreen';
import { RootStackParamList } from '@/types/mobile-utils';

const AppStack = createStackNavigator<RootStackParamList>();

function AppNavigation() {
  return (
      <AppStack.Navigator 
        initialRouteName="Home"
      >
        <AppStack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        <AppStack.Screen 
          name="AddRecipe" 
          component={AddRecipeScreen} 
        />
        <AppStack.Screen 
          name="RecipeDetail" 
          component={RecipeDetailScreen} 
        />
      </AppStack.Navigator>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <AppNavigation />
    </>
  );
}