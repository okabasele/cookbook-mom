import iOS from '@/styles/ios';
import { Plus } from 'lucide-react-native';
import { TouchableOpacity, StyleSheet } from 'react-native';

export const ButtonAddRecipe = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.addButton}>
      <Plus size={28} color={iOS.colors.tint} strokeWidth={2} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
