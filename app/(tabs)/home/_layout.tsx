import { ButtonAddRecipe } from "@/components/ButtonAddRecipe";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack, Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function HomeLayout() {
  const rawTheme = useColorScheme();
  const theme = rawTheme === "dark" ? "dark" : "light";
  const isGlassAvailable = isLiquidGlassAvailable();
  const blurEffect =
    theme === "dark" ? "systemMaterialDark" : "systemMaterialLight";

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitle: true,
          headerTransparent: true,
          headerTintColor: theme === 'dark' ? 'white' : 'black',
          headerLargeStyle: { backgroundColor: 'transparent' },
          headerBlurEffect: isGlassAvailable ? undefined : blurEffect,
          title: 'Mes recettes',
        }}
      />
    </Stack>
  );
}