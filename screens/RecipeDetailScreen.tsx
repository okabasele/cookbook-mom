import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import { Recipe } from '../types/Recipe';
import { getRecipeById, getRecipeFamily, deleteRecipe } from '../utils/storage';
import iOS from '@/styles/ios';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { NavButton } from '@/components/ui/NavButton';
import CheckboxItem from '@/components/ui/CheckboxItem';
import Section from '@/components/ui/Section';

// ===========================
// 🧩 SUB-COMPONENTS
// ===========================

// Section Header Component
interface SectionHeaderProps {
  children: string;
  count?: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ children, count }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>
      {children} {count !== undefined && `(${count})`}
    </Text>
  </View>
);

// ===========================
// 🏠 MAIN COMPONENT
// ===========================

export function RecipeDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { recipeId } = useLocalSearchParams() as { recipeId: string };
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeFamily, setRecipeFamily] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Checkbox states for ingredients and steps
  const [checkedIngredients, setCheckedIngredients] = useState<
    Record<number, boolean>
  >({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadRecipe();
    navigation.setOptions({
      headerLeft: () => (
        <NavButton
          onPress={() => router.dismissTo("/(tabs)" as any)}
          icon={<ChevronLeft size={18} color={iOS.colors.tint} />}
        />
      ),
      headerRight: () => (
        <NavButton
          onPress={exportToPDF}
          label="Export"
          icon={<Share2 size={18} color={iOS.colors.tint} />}
        />
      ),
    });
  }, [recipeId]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const loadedRecipe = await getRecipeById(recipeId);
      if (!loadedRecipe) {
        Alert.alert('Erreur', 'Recette introuvable');
        router.dismissTo("/(tabs)" as any);
        return;
      }

      setRecipe(loadedRecipe);
      navigation.setOptions({ title: loadedRecipe.title || 'Détails de la recette' });

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

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const exportToPDF = async () => {
    if (!recipe) return;

    try {
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
                border-bottom: 3px solid #8B2B3E;
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
                color: #8B2B3E;
                margin: 0;
                font-size: 32px;
              }
              h2 {
                color: #374151;
                margin-top: 40px;
                margin-bottom: 20px;
                font-size: 24px;
                border-left: 4px solid #8B2B3E;
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
                ${
                  recipe.detectedLanguage === 'en'
                    ? '🇺🇸 English Recipe'
                    : '🇫🇷 Recette en Français'
                }
                ${!recipe.isOriginal ? ' (Traduite)' : ''}
              </div>
              <h1>${recipe.title}</h1>
            </div>

            <h2>${
              recipe.detectedLanguage === 'fr' ? 'Ingrédients' : 'Ingredients'
            }</h2>
            <ul>
              ${recipe.ingredients
                .map((ingredient) => `<li>${ingredient}</li>`)
                .join('')}
            </ul>

            <h2>${
              recipe.detectedLanguage === 'fr'
                ? 'Étapes de préparation'
                : 'Preparation Steps'
            }</h2>
            <ol>
              ${recipe.steps.map((step) => `<li>${step}</li>`).join('')}
            </ol>

            <div class="date">
              ${
                recipe.detectedLanguage === 'fr'
                  ? 'Recette ajoutée le'
                  : 'Recipe added on'
              } ${new Date(recipe.createdAt).toLocaleDateString('fr-FR')}
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Partager la recette PDF',
        });
      } else {
        Alert.alert('Succès', 'PDF généré et sauvegardé dans vos fichiers');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de générer le PDF');
    }
  };

  const shareRecipe = async () => {
    if (!recipe) return;

    const content = `
📝 ${recipe.title}
${
  recipe.detectedLanguage === 'en'
    ? '🇺🇸 English Recipe'
    : '🇫🇷 Recette Française'
}

${recipe.detectedLanguage === 'fr' ? 'Ingrédients:' : 'Ingredients:'}
${recipe.ingredients.map((ingredient) => `• ${ingredient}`).join('\n')}

${recipe.detectedLanguage === 'fr' ? 'Étapes:' : 'Steps:'}
${recipe.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
    `.trim();

    try {
      await Share.share({
        message: content,
        title: recipe.title,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager la recette');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la recette',
      'Êtes-vous sûr de vouloir supprimer cette recette? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    if (!recipe) return;

    try {
      await deleteRecipe(recipe.id);
      Alert.alert('Supprimé', 'La recette a été supprimée avec succès', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de supprimer la recette');
    }
  };

  const getLanguageFlag = () => {
    if (!recipe) return '🇫🇷';
    return recipe.detectedLanguage === 'fr' ? '🇫🇷' : '🇺🇸';
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleExport = () => {
    Alert.alert('Export Options', "Choisissez le format d'export", [
      {
        text: 'PDF',
        onPress: exportToPDF,
      },
      {
        text: 'Partager',
        onPress: shareRecipe,
      },
      {
        text: 'Annuler',
        style: 'cancel',
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Chargement de la recette...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>Recette introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Title Section */}
      <View style={styles.titleSection}>
        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>{getLanguageFlag()}</Text>
          <Text style={styles.metadataText}>•</Text>
          <Text style={styles.metadataText}>
            {recipe.detectedLanguage === 'fr' ? 'Français' : 'English'}
          </Text>
          {!recipe.isOriginal && (
            <>
              <Text style={styles.metadataText}>•</Text>
              <Text style={styles.metadataText}>Traduit</Text>
            </>
          )}
        </View>
      </View>

      {/* Ingredients Section */}
      <Section title="Ingrédients" count={recipe.ingredients.length}>
        {recipe.ingredients.map((ingredient, index) => (
          <CheckboxItem
            key={index}
            checked={checkedIngredients[index] || false}
            onChange={() => toggleIngredient(index)}
            isLast={index === recipe.ingredients.length - 1}
          >
            {ingredient}
          </CheckboxItem>
        ))}
      </Section>

      {/* Steps Section */}
      <Section title="Étapes de préparation" count={recipe.steps.length}>
        {recipe.steps.map((step, index) => (
          <CheckboxItem
            key={index}
            number={index + 1}
            checked={checkedSteps[index] || false}
            onChange={() => toggleStep(index)}
            isLast={index === recipe.steps.length - 1}
          >
            {step}
          </CheckboxItem>
        ))}
      </Section>

      {/* Recipe Family (Translations) */}
      {recipeFamily.length > 1 && (
        <View style={styles.familySection}>
          <Text style={styles.familyTitle}>📚 Autres langues disponibles</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recipeFamily.map((familyRecipe) => (
              <TouchableOpacity
                key={familyRecipe.id}
                style={[
                  styles.languageCard,
                  familyRecipe.id === recipe.id && styles.currentLanguageCard,
                ]}
                onPress={() => {
                  if (familyRecipe.id !== recipe.id) {
                    router.replace(`/recipe/${familyRecipe.id}` as any);
                  }
                }}
              >
                <Text style={styles.languageCardText}>
                  {familyRecipe.detectedLanguage === 'en'
                    ? '🇺🇸 English'
                    : '🇫🇷 Français'}
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
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>
            🗑️ Supprimer cette recette
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ===========================
// 🎨 STYLES
// ===========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOS.colors.systemBackground,
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 34,
  },

  // Title Section
  titleSection: {
    padding: iOS.spacing.standard * 2,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metadataText: {
    ...iOS.typography.subheadline,
    color: iOS.colors.secondaryLabel,
  },

  // Section
  section: {
    marginTop: iOS.spacing.standard,
  },
  sectionHeader: {
    paddingTop: 20,
    paddingBottom: 8,
    paddingHorizontal: iOS.spacing.standard,
  },
  sectionHeaderText: {
    ...iOS.typography.headline,
    color: iOS.colors.label,
  },

  // Recipe Family
  familySection: {
    paddingHorizontal: iOS.spacing.standard,
    paddingVertical: iOS.spacing.standard * 2,
    borderTopWidth: 0.5,
    borderTopColor: iOS.colors.separator,
    backgroundColor: iOS.colors.secondarySystemBackground,
  },
  familyTitle: {
    ...iOS.typography.headline,
    color: iOS.colors.label,
    marginBottom: iOS.spacing.standard,
  },
  languageCard: {
    backgroundColor: iOS.colors.systemBackground,
    borderRadius: 10,
    padding: iOS.spacing.standard,
    marginRight: iOS.spacing.standard,
    borderWidth: 1,
    borderColor: iOS.colors.separator,
    minWidth: 120,
    alignItems: 'center',
  },
  currentLanguageCard: {
    borderColor: iOS.colors.tint,
    backgroundColor: iOS.colors.systemBackground,
    borderWidth: 2,
  },
  languageCardText: {
    ...iOS.typography.body,
    fontWeight: '600',
    color: iOS.colors.label,
    textAlign: 'center',
  },
  originalBadge: {
    ...iOS.typography.footnote,
    color: iOS.colors.systemGreen,
    fontWeight: '700',
    marginTop: iOS.spacing.compact / 2,
  },

  // Action Buttons
  actionButtons: {
    padding: iOS.spacing.standard,
    gap: iOS.spacing.standard,
    paddingBottom: iOS.spacing.standard * 2,
  },
  deleteButton: {
    backgroundColor: iOS.colors.systemBackground,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: iOS.spacing.standard,
    alignItems: 'center',
    minHeight: 50,
  },
  deleteButtonText: {
    ...iOS.typography.body,
    color: iOS.colors.systemRed,
  },

  // Loading & Error
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: iOS.colors.systemBackground,
  },
  loadingText: {
    ...iOS.typography.headline,
    color: iOS.colors.tint,
  },
  errorText: {
    ...iOS.typography.headline,
    color: iOS.colors.systemRed,
  },
});
