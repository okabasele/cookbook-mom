import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { HomeScreen } from '@/screens/HomeScreen';
import { AddRecipeScreen } from '@/screens/AddRecipeScreen';
import { RecipeDetailScreen } from '@/screens/RecipeDetailScreen';
import { RootStackParamList } from '@/types/mobile-utils';
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useColorScheme } from "react-native";
import { ButtonAddRecipe } from '@/components/ButtonAddRecipe';
const AppStack = createNativeStackNavigator <RootStackParamList>();

function AppNavigation() {
    const rawTheme = useColorScheme();
  const theme = rawTheme === "dark" ? "dark" : "light";
  const isGlassAvailable = isLiquidGlassAvailable();
  const blurEffect =
    theme === "dark" ? "systemMaterialDark" : "systemMaterialLight";
  return (
      <AppStack.Navigator 
        initialRouteName="Home"
        // screenOptions={{ headerShown: false }}
      >
        <AppStack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({
            headerLargeTitle: true,
            headerTransparent: true,
            headerTintColor: theme === "dark" ? "white" : "black",
            headerLargeStyle: { backgroundColor: "transparent" },
            headerBlurEffect: isGlassAvailable ? undefined : blurEffect,
            title: "Mes recettes",
            headerRight: () => <ButtonAddRecipe onPress={() => navigation.navigate('AddRecipe')} />,
          })}
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