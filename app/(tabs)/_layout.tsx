import iOS from '@/styles/ios';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={DynamicColorIOS({
        dark: iOS.colors.tintLight,
        light: iOS.colors.tint,
      })}
    >
      <NativeTabs.Trigger name="index">
        <Label>Recettes</Label>
        <Icon sf="book" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="add-recipe">
        <Icon sf="plus.circle" />
        <Label>Ajouter</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="conversion">
        <Icon sf="numbers" />
        <Label>Conversion</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf="gear" />
        <Label>Paramètres</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
