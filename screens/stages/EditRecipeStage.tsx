import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Plus } from 'lucide-react-native';
import { IngredientItem } from '../../components/IngredientItem';
import { StepItem } from '../../components/StepItem';
import iOS from '../../styles/ios';

interface ConvertedItem {
  converted: string;
  original: string;
}

interface EditRecipeStageProps {
  title: string;
  onTitleChange: (title: string) => void;
  ingredients: ConvertedItem[];
  onUpdateIngredient: (index: number, ingredient: ConvertedItem) => void;
  onDeleteIngredient: (index: number) => void;
  onAddIngredient: () => void;
  steps: ConvertedItem[];
  onUpdateStep: (index: number, step: ConvertedItem) => void;
  onDeleteStep: (index: number) => void;
  onAddStep: () => void;
  prepTime: number;
  onPrepTimePress: () => void;
  cookTime: number;
  onCookTimePress: () => void;
  difficulty: string;
  onDifficultyPress: () => void;
  selectedLanguageFlag: string;
  selectedLanguageName: string;
}

const SectionHeader = ({ children, count }: { children: string; count?: number }) => (
  <Text style={styles.sectionHeader}>
    {children} {count !== undefined && `(${count})`}
  </Text>
);

const AddButton = ({ onPress, children }: { onPress: () => void; children: string }) => (
  <TouchableOpacity style={styles.addButton} onPress={onPress}>
    <Plus size={20} color={iOS.colors.tint} strokeWidth={2.5} />
    <Text style={styles.addButtonText}>{children}</Text>
  </TouchableOpacity>
);

const InfoRow = ({ label, value, onPress }: { label: string; value: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.infoRow} onPress={onPress}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </TouchableOpacity>
);

const getDifficultyLabel = (difficulty: string) => {
  const map: { [key: string]: string } = {
    facile: 'Facile',
    moyen: 'Moyen',
    difficile: 'Difficile',
  };
  return map[difficulty] || 'Facile';
};

export function EditRecipeStage({
  title,
  onTitleChange,
  ingredients,
  onUpdateIngredient,
  onDeleteIngredient,
  onAddIngredient,
  steps,
  onUpdateStep,
  onDeleteStep,
  onAddStep,
  prepTime,
  onPrepTimePress,
  cookTime,
  onCookTimePress,
  difficulty,
  onDifficultyPress,
  selectedLanguageFlag,
  selectedLanguageName,
}: EditRecipeStageProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* AI Badge */}
      <View style={styles.aiBadge}>
        <Text style={styles.aiBadgeText}>
          ✨ Généré et traduit par intelligence artificielle
        </Text>
      </View>

      {/* Title */}
      <SectionHeader>Titre</SectionHeader>
      <View style={styles.section}>
        <TextInput
          value={title}
          onChangeText={onTitleChange}
          placeholder="Nom de la recette"
          placeholderTextColor={iOS.colors.tertiaryLabel}
          style={styles.titleInput}
        />
      </View>

      {/* Ingredients */}
      <SectionHeader count={ingredients.length}>Ingrédients</SectionHeader>
      <View style={styles.section}>
        {ingredients.map((ingredient, index) => (
          <IngredientItem
            key={index}
            ingredient={ingredient}
            onUpdate={(ing) => onUpdateIngredient(index, ing)}
            onDelete={() => onDeleteIngredient(index)}
          />
        ))}
        <AddButton onPress={onAddIngredient}>Ajouter un ingrédient</AddButton>
      </View>

      {/* Steps */}
      <SectionHeader count={steps.length}>Étapes</SectionHeader>
      <View style={styles.section}>
        {steps.map((step, index) => (
          <StepItem
            key={index}
            number={index + 1}
            step={step}
            onUpdate={(st) => onUpdateStep(index, st)}
            onDelete={() => onDeleteStep(index)}
          />
        ))}
        <AddButton onPress={onAddStep}>Ajouter une étape</AddButton>
      </View>

      {/* Info */}
      <SectionHeader>Informations</SectionHeader>
      <View style={styles.section}>
        <InfoRow
          label="Préparation"
          value={`${prepTime} min`}
          onPress={onPrepTimePress}
        />
        <InfoRow
          label="Cuisson"
          value={`${cookTime} min`}
          onPress={onCookTimePress}
        />
        <InfoRow
          label="Difficulté"
          value={getDifficultyLabel(difficulty)}
          onPress={onDifficultyPress}
        />
      </View>

      {/* Language Badge */}
      <View style={styles.languageBadge}>
        <Text style={styles.languageBadgeText}>
          {selectedLanguageFlag} Recette en {selectedLanguageName}
        </Text>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  aiBadge: {
    padding: iOS.spacing.standard,
    alignItems: 'center',
  },

  aiBadgeText: {
    ...iOS.typography.footnote,
    color: iOS.colors.secondaryLabel,
    textAlign: 'center',
  },

  sectionHeader: {
    ...iOS.typography.footnote,
    color: iOS.colors.secondaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: iOS.spacing.standard,
    paddingTop: 12,
    paddingBottom: 8,
  },

  section: {
    marginHorizontal: iOS.spacing.standard,
    marginBottom: iOS.spacing.standard,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: iOS.colors.systemBackground,
  },

  titleInput: {
    ...iOS.typography.title3,
    color: iOS.colors.label,
    backgroundColor: iOS.colors.systemBackground,
    padding: iOS.spacing.standard,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: iOS.spacing.compact,
    backgroundColor: iOS.colors.systemBackground,
    borderBottomWidth: 0.5,
    borderBottomColor: iOS.colors.separator,
    padding: 12,
    paddingHorizontal: iOS.spacing.standard,
    minHeight: 44,
  },

  addButtonText: {
    ...iOS.typography.body,
    color: iOS.colors.tint,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: iOS.colors.systemBackground,
    borderBottomWidth: 0.5,
    borderBottomColor: iOS.colors.separator,
    padding: 12,
    paddingHorizontal: iOS.spacing.standard,
    minHeight: 44,
  },

  infoLabel: {
    ...iOS.typography.body,
    color: iOS.colors.label,
  },

  infoValue: {
    ...iOS.typography.body,
    color: iOS.colors.secondaryLabel,
  },

  languageBadge: {
    padding: iOS.spacing.standard,
    paddingBottom: 0,
    alignItems: 'center',
  },

  languageBadgeText: {
    ...iOS.typography.footnote,
    color: iOS.colors.secondaryLabel,
    textAlign: 'center',
  },

  bottomSpacer: {
    height: 34,
  },
});
