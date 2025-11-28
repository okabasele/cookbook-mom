import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import iOS from '../../styles/ios';
import Section from '@/components/ui/Section';
import InfoRow from '@/components/ui/InfoRow';
import ConvertedList from '@/components/ui/ConvertedList';
import InfoBadge from '@/components/ui/InfoBadge';

interface EditRecipeStageProps {
  title: string;
  onTitleChange: (title: string) => void;
  ingredients: string[];
  onUpdateIngredient: (index: number, ingredient: string) => void;
  onDeleteIngredient: (index: number) => void;
  onAddIngredient: () => void;
  steps: string[];
  onUpdateStep: (index: number, step: string) => void;
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

const getDifficultyLabel = (difficulty: string) => {
  const map: { [key: string]: string } = {
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      {/* AI Badge */}
      <InfoBadge text="Généré et traduit par intelligence artificielle" icon="✨"/>

      {/* Title */}
      <Section title="Titre">
        <TextInput
          value={title}
          onChangeText={onTitleChange}
          placeholder="Nom de la recette"
          placeholderTextColor={iOS.colors.tertiaryLabel}
          style={styles.titleInput}
        />
      </Section>

      {/* Ingredients */}
      <ConvertedList
      buttonTitle='Ajouter un ingrédient'
      title='Ingrédients'
      items={ingredients}
      onUpdateItem={onUpdateIngredient}
      onDeleteItem={onDeleteIngredient}
      onAddItem={onAddIngredient}
      />

      {/* Steps */}
      <ConvertedList
      title='Etapes'
      buttonTitle='Ajouter une étape'
      items={steps}
      onUpdateItem={onUpdateStep}
      onDeleteItem={onDeleteStep}
      onAddItem={onAddStep}
      displayNumbers={true}
      />

      {/* Info */}
      <Section title="Informations">
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
          hideDivider={true}
        />
      </Section>

      {/* Language Badge */}
      <InfoBadge text={`Recette en ${selectedLanguageName}`} icon={selectedLanguageFlag}/>

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
    padding: 12,
    paddingHorizontal: iOS.spacing.standard,
    minHeight: 44,
  },

  addButtonText: {
    ...iOS.typography.body,
    color: iOS.colors.tint,
  },
});
