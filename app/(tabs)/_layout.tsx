import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Home, PlusCircle, Settings } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  return (
      <NativeTabs>
        <NativeTabs.Trigger name="home">
          <Label>Home</Label>
          <Icon sf="house.fill" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="add-recipe">
          <Icon sf="plus.circle" />
          <Label>Ajouter</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <Icon sf="gear" />
          <Label>Settings</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
  );
}
