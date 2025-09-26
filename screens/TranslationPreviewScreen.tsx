import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Alert
} from 'react-native';
import { translateRecipe } from '../utils/translation';
import { saveRecipe, updateRecipeTranslationIds } from '../utils/storage';
import { Recipe, TranslationPreviewData, MockTranslation } from '../types/Recipe';
import { theme, commonStyles } from '../styles/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/mobile-utils';

type Props = StackScreenProps<RootStackParamList, 'TranslationPreview'>;

export function TranslationPreviewScreen({ route, navigation }: Props) {
  const { recipe } = route.params;
  const [translatedRecipe, setTranslatedRecipe] = useState<MockTranslation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    performTranslation();
  }, []);

  const performTranslation = async () => {
    try {
      setIsLoading(true);
      const translation = await translateRecipe(recipe);
      setTranslatedRecipe(translation);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de traduire la recette');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const saveTranslation = async () => {
    if (!translatedRecipe) return;

    try {
      setIsSaving(true);
      
      // Save original recipe
      const originalRecipe: Recipe = {
        id: `original_${Date.now()}`,
        title: recipe.title,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        detectedLanguage: recipe.detectedLanguage,
        createdAt: new Date().toISOString(),
        isOriginal: true,
        translationIds: []
      };

      // Save translated recipe
      const translatedRecipeData: Recipe = {
        id: `translation_${Date.now()}`,
        title: translatedRecipe.title,
        ingredients: translatedRecipe.ingredients,
        steps: translatedRecipe.steps,
        detectedLanguage: translatedRecipe.targetLanguage,
        createdAt: new Date().toISOString(),
        isOriginal: false,
        originalRecipeId: originalRecipe.id,
        translationIds: []
      };

      // Update original with translation reference
      originalRecipe.translationIds = [translatedRecipeData.id];

      await saveRecipe(originalRecipe);
      await saveRecipe(translatedRecipeData);

      Alert.alert(
        'Succès!', 
        'Les recettes ont été sauvegardées avec succès',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les recettes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={commonStyles.loading}>
        <Text style={styles.loadingIcon}>🔄</Text>
        <Text style={commonStyles.loadingText}>Traduction en cours...</Text>
        <Text style={styles.loadingSubtext}>
          Notre système analyse votre recette et la traduit avec précision
        </Text>
      </View>
    );
  }

  if (!translatedRecipe) {
    return (
      <View style={commonStyles.loading}>
        <Text style={styles.errorText}>Erreur de traduction</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Traduction: {recipe.detectedLanguage === 'en' ? '🇺🇸 → 🇫🇷' : '🇫🇷 → 🇺🇸'}
        </Text>
        <Text style={styles.headerSubtext}>
          Vérifiez la traduction avant de la sauvegarder
        </Text>
      </View>

      <View style={styles.comparisonContainer}>
        {/* Original Recipe */}
        <View style={styles.recipeColumn}>
          <Text style={styles.columnHeader}>
            {recipe.detectedLanguage === 'en' ? '🇺🇸 Original' : '🇫🇷 Original'}
          </Text>
          <View style={[commonStyles.card, styles.originalCard]}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            
            <Text style={styles.sectionTitle}>
              {recipe.detectedLanguage === 'fr' ? 'Ingrédients:' : 'Ingredients:'}
            </Text>
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>• {ingredient}</Text>
            ))}
            
            <Text style={styles.sectionTitle}>
              {recipe.detectedLanguage === 'fr' ? 'Étapes:' : 'Steps:'}
            </Text>
            {recipe.steps.map((step, index) => (
              <Text key={index} style={styles.stepText}>{index + 1}. {step}</Text>
            ))}
          </View>
        </View>

        {/* Translated Recipe */}
        <View style={styles.recipeColumn}>
          <Text style={styles.columnHeader}>
            {translatedRecipe.targetLanguage === 'fr' ? '🇫🇷 Traduction' : '🇺🇸 Translation'}
          </Text>
          <View style={[commonStyles.card, styles.translatedCard]}>
            <Text style={styles.recipeTitle}>{translatedRecipe.title}</Text>
            
            <Text style={styles.sectionTitle}>
              {translatedRecipe.targetLanguage === 'fr' ? 'Ingrédients:' : 'Ingredients:'}
            </Text>
            {translatedRecipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>• {ingredient}</Text>
            ))}
            
            <Text style={styles.sectionTitle}>
              {translatedRecipe.targetLanguage === 'fr' ? 'Étapes:' : 'Steps:'}
            </Text>
            {translatedRecipe.steps.map((step, index) => (
              <Text key={index} style={styles.stepText}>{index + 1}. {step}</Text>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Cette traduction a été générée automatiquement. Vous pourrez la modifier après sauvegarde.
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[commonStyles.button, commonStyles.primaryButton, isSaving && styles.disabledButton]}
          onPress={saveTranslation}
          disabled={isSaving}
        >
          <Text style={commonStyles.buttonText}>
            {isSaving ? '⏳ Sauvegarde...' : '💾 Sauvegarder la Traduction'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[commonStyles.button, commonStyles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={commonStyles.buttonText}>❌ Retour</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.gray50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  
  headerText: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  headerSubtext: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  loadingIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.lg,
  },
  
  loadingSubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
  },
  
  errorText: {
    ...theme.typography.subtitle,
    color: theme.colors.danger,
  },
  
  comparisonContainer: {
    flexDirection: 'row',
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  
  recipeColumn: {
    flex: 1,
  },
  
  columnHeader: {
    ...theme.typography.body,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.md,
  },
  
  originalCard: {
    borderColor: theme.colors.textSecondary,
  },
  
  translatedCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.blue50,
  },
  
  recipeTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  
  sectionTitle: {
    ...theme.typography.body,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  
  ingredientText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  
  stepText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  
  infoBox: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.blue50,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  
  infoText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontStyle: 'italic',
  },
  
  actionButtons: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  
  disabledButton: {
    opacity: 0.6,
  },
});