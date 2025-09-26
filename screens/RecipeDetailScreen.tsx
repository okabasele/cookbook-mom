import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  Share
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Recipe } from '../types/Recipe';
import { getRecipeById, getRecipeFamily, deleteRecipe } from '../utils/storage';
import { theme, commonStyles } from '../styles/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/mobile-utils';

type Props = StackScreenProps<RootStackParamList, 'RecipeDetail'>;


export function RecipeDetailScreen({ route, navigation }: Props) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeFamily, setRecipeFamily] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const loadedRecipe = await getRecipeById(recipeId);
      if (!loadedRecipe) {
        Alert.alert('Erreur', 'Recette introuvable');
        navigation.goBack();
        return;
      }
      
      setRecipe(loadedRecipe);
      
      // Load recipe family (original + translations)
      const family = await getRecipeFamily(recipeId);
      setRecipeFamily(family);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger la recette');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!recipe) return;
    
    try {
      setIsExporting(true);
      
      const html = `
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 40px; 
                font-size: 16px; 
                line-height: 1.6;
                color: #111827;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
              }
              .language { 
                background: #f3f4f6; 
                padding: 12px; 
                border-radius: 8px; 
                text-align: center;
                margin-bottom: 20px;
                font-size: 14px;
                color: #6b7280;
              }
              h1 { 
                color: #2563eb; 
                margin: 0;
                font-size: 32px;
              }
              h2 { 
                color: #374151; 
                margin-top: 40px; 
                margin-bottom: 20px;
                font-size: 24px;
                border-left: 4px solid #2563eb;
                padding-left: 16px;
              }
              ul, ol { 
                padding-left: 30px; 
              }
              li { 
                margin-bottom: 12px; 
                line-height: 1.6; 
              }
              .date {
                text-align: center;
                color: #6b7280;
                font-style: italic;
                margin-top: 40px;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="language">
                ${recipe.detectedLanguage === 'en' ? '🇺🇸 English Recipe' : '🇫🇷 Recette en Français'}
                ${!recipe.isOriginal ? ' (Traduite)' : ''}
              </div>
              <h1>${recipe.title}</h1>
            </div>
            
            <h2>${recipe.detectedLanguage === 'fr' ? 'Ingrédients' : 'Ingredients'}</h2>
            <ul>
              ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            
            <h2>${recipe.detectedLanguage === 'fr' ? 'Étapes de préparation' : 'Preparation Steps'}</h2>
            <ol>
              ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
            
            <div class="date">
              ${recipe.detectedLanguage === 'fr' ? 'Recette ajoutée le' : 'Recipe added on'} ${new Date(recipe.createdAt).toLocaleDateString('fr-FR')}
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ 
        html,
        base64: false
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Partager la recette PDF'
        });
      } else {
        Alert.alert('Succès', 'PDF généré et sauvegardé dans vos fichiers');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de générer le PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleTranslate = () => {
    if (!recipe) return;
    
    navigation.navigate('TranslationPreview', {
      recipe: {
        title: recipe.title,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        detectedLanguage: recipe.detectedLanguage
      }
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la recette',
      'Êtes-vous sûr de vouloir supprimer cette recette? Cette action est irréversible.',
      [
        { 
          text: 'Annuler', 
          style: 'cancel' 
        },
        { 
          text: 'Supprimer', 
          style: 'destructive', 
          onPress: confirmDelete 
        }
      ]
    );
  };

  const confirmDelete = async () => {
    if (!recipe) return;
    
    try {
      await deleteRecipe(recipe.id);
      Alert.alert(
        'Supprimé', 
        'La recette a été supprimée avec succès',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de supprimer la recette');
    }
  };

  const shareRecipe = async () => {
    if (!recipe) return;
    
    const content = `
📝 ${recipe.title}
${recipe.detectedLanguage === 'en' ? '🇺🇸 English Recipe' : '🇫🇷 Recette Française'}

${recipe.detectedLanguage === 'fr' ? 'Ingrédients:' : 'Ingredients:'}
${recipe.ingredients.map(ingredient => `• ${ingredient}`).join('\n')}

${recipe.detectedLanguage === 'fr' ? 'Étapes:' : 'Steps:'}
${recipe.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
    `.trim();

    try {
      await Share.share({
        message: content,
        title: recipe.title
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager la recette');
    }
  };

  if (loading) {
    return (
      <View style={commonStyles.loading}>
        <Text style={commonStyles.loadingText}>Chargement de la recette...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={commonStyles.loading}>
        <Text style={styles.errorText}>Recette introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header with language indicator */}
      <View style={styles.header}>
        <Text style={styles.languageIndicator}>
          {recipe.detectedLanguage === 'en' ? '🇺🇸 English' : '🇫🇷 Français'}
          {!recipe.isOriginal && ' (Traduite)'}
        </Text>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.dateText}>
          Ajouté le {new Date(recipe.createdAt).toLocaleDateString('fr-FR')}
        </Text>
        {!recipe.isOriginal && (
          <TouchableOpacity 
            style={styles.viewOriginalButton}
            onPress={() => navigation.push('RecipeDetail', { recipeId: recipe.originalRecipeId! })}
          >
            <Text style={styles.viewOriginalText}>📖 Voir l'original</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Recipe Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          {recipe.detectedLanguage === 'fr' ? 'Ingrédients' : 'Ingredients'}
        </Text>
        <View style={styles.ingredientsList}>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredientText}>• {ingredient}</Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          {recipe.detectedLanguage === 'fr' ? 'Étapes de préparation' : 'Preparation Steps'}
        </Text>
        <View style={styles.stepsList}>
          {recipe.steps.map((step, index) => (
            <Text key={index} style={styles.stepText}>{index + 1}. {step}</Text>
          ))}
        </View>
      </View>

      {/* Translation Family */}
      {recipeFamily.length > 1 && (
        <View style={styles.familySection}>
          <Text style={styles.familyTitle}>📚 Autres langues disponibles</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recipeFamily.map((familyRecipe) => (
              <TouchableOpacity
                key={familyRecipe.id}
                style={[
                  styles.languageCard,
                  familyRecipe.id === recipe.id && styles.currentLanguageCard
                ]}
                onPress={() => navigation.replace('RecipeDetail', { recipeId: familyRecipe.id })}
              >
                <Text style={styles.languageCardText}>
                  {familyRecipe.detectedLanguage === 'en' ? '🇺🇸 English' : '🇫🇷 Français'}
                </Text>
                {familyRecipe.isOriginal && (
                  <Text style={styles.originalBadge}>Original</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[commonStyles.button, commonStyles.primaryButton, isExporting && styles.disabledButton]}
          onPress={exportToPDF}
          disabled={isExporting}
        >
          <Text style={commonStyles.buttonText}>
            {isExporting ? '⏳ Génération...' : '🖨️ Exporter PDF'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[commonStyles.button, commonStyles.secondaryButton]}
          onPress={shareRecipe}
        >
          <Text style={commonStyles.buttonText}>📤 Partager</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[commonStyles.button, styles.translateButton]}
          onPress={handleTranslate}
        >
          <Text style={commonStyles.buttonText}>
            🌍 Traduire vers {recipe.detectedLanguage === 'en' ? 'Français' : 'English'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[commonStyles.button, commonStyles.dangerButton]}
          onPress={handleDelete}
        >
          <Text style={commonStyles.buttonText}>🗑️ Supprimer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: theme.colors.gray50,
  },
  
  languageIndicator: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  dateText: {
    ...theme.typography.captionSmall,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  
  viewOriginalButton: {
    marginTop: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  
  viewOriginalText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  
  content: {
    padding: theme.spacing.lg,
  },
  
  sectionTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    paddingLeft: theme.spacing.md,
  },
  
  ingredientsList: {
    marginBottom: theme.spacing.xl,
  },
  
  ingredientText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 26,
    marginBottom: theme.spacing.sm,
  },
  
  stepsList: {
    marginBottom: theme.spacing.lg,
  },
  
  stepText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 26,
    marginBottom: theme.spacing.md,
  },
  
  familySection: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    backgroundColor: theme.colors.gray50,
  },
  
  familyTitle: {
    ...theme.typography.body,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  
  languageCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 120,
    alignItems: 'center',
  },
  
  currentLanguageCard: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.blue50,
  },
  
  languageCardText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  
  originalBadge: {
    ...theme.typography.captionSmall,
    color: theme.colors.success,
    fontWeight: 'bold',
    marginTop: theme.spacing.xs,
  },
  
  actionButtons: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  
  translateButton: {
    backgroundColor: theme.colors.warning,
  },
  
  disabledButton: {
    opacity: 0.6,
  },
  
  errorText: {
    ...theme.typography.subtitle,
    color: theme.colors.danger,
  },
});