import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        {/* Define the Native Tabs */}
        <Stack.Screen name="(tabs)" options={{headerShown:false}} />

        {/* Define the Recipe Detail screen as part of the stack */}
        <Stack.Screen
          name="recipe-detail/[recipeId]"
          options={{
            title: 'Recipe Detail',
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}