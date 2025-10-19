import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useColorScheme } from "react-native";
import iOS from '@/styles/ios';


export default function RootLayout() {

    const rawTheme = useColorScheme();
    const theme = rawTheme === "dark" ? "dark" : "light";
    const isGlassAvailable = isLiquidGlassAvailable();
    const blurEffect =
      theme === "dark" ? "systemMaterialDark" : "systemMaterialLight";
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        {/* Define the Native Tabs */}
        <Stack.Screen name="(tabs)" options={{headerShown:false}} />

        {/* Define the Recipe Detail screen as part of the stack */}
        <Stack.Screen
          name="recipe-detail/[recipeId]"
          options={{  headerLargeTitle: true,
          headerTransparent: true,
          headerTintColor: theme === 'dark' ? 'white' : 'black',
          headerLargeStyle: { backgroundColor: 'transparent' },
          headerBlurEffect: isGlassAvailable ? undefined : blurEffect,
          
           }}
        />
         <Stack.Screen
          name="calculator/[category]"
          options={{  headerLargeTitle: true,
          headerTransparent: true,
          headerTintColor: theme === 'dark' ? 'white' : 'black',
          headerLargeStyle: { backgroundColor: 'transparent' },
          headerBlurEffect: isGlassAvailable ? undefined : blurEffect,
          title: 'Calculatrice',
           }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}