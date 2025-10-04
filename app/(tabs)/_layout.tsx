import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <Label>
            Recettes
          </Label>
          <Icon sf="book" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="add-recipe">
          <Icon sf="plus.circle" />
          <Label>Ajouter</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <Icon sf="gear" />
          <Label>Paramètres</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
  );
}
