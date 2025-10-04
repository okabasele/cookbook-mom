import iOS from "@/styles/ios";
import { Text, View, StyleSheet } from "react-native";

type EmptyStateProps = {
  onAddRecipe?: () => void;
};
const EmptyState = ({ onAddRecipe }: EmptyStateProps) => (
  <View style={styles.emptyStateContainer}>
    <Text style={styles.emptyTitle}>Aucune recette</Text>
    <Text style={styles.emptySubtitle}>
      Commencez par ajouter votre première recette
    </Text>
  </View>
);
const styles = StyleSheet.create({
  emptyStateContainer: {
    padding: 64,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: iOS.spacing.standard * 2,
  },
  emptyTitle: {
    ...iOS.typography.title2,
    color: iOS.colors.label,
    marginBottom: iOS.spacing.compact,
  },
  emptySubtitle: {
    ...iOS.typography.body,
    color: iOS.colors.secondaryLabel,
    textAlign: 'center',
    maxWidth: 280,
  }})

export default EmptyState;