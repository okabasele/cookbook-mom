import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import iOS from '../styles/ios';
import { URLInputStage } from './stages/URLInputStage';
import { AnalyzingStage } from './stages/AnalyzingStage';
import { EditRecipeStage } from './stages/EditRecipeStage';
import { mockYouTubeExtraction } from '../utils/conversions';
import  PickerModal from '@/components/ui/PickerModal';
import { ConvertedItem } from '@/types/mobile-utils';

const LANGUAGES = [
  { value: 'fr', label: 'Français', icon: '🇫🇷' },
  { value: 'en', label: 'English', icon: '🇺🇸' },
  { value: 'es', label: 'Español', icon: '🇪🇸' },
  { value: 'de', label: 'Deutsch', icon: '🇩🇪' },
  { value: 'it', label: 'Italiano', icon: '🇮🇹' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Facile', icon: '🟢' },
  { value: 'medium', label: 'Moyen', icon: '🟡' },
  { value: 'hard', label: 'Difficile', icon: '🔴' },
];

type Stage = 'input' | 'analyzing' | 'edit';

export function AddRecipeScreen() {
  const router = useRouter();

  // Stage management
  const [stage, setStage] = useState<Stage>('edit');
  const [analysisStep, setAnalysisStep] = useState(0); // 0: Extract, 1: Translate, 2: Convert

  // Form data
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [targetLang, setTargetLang] = useState('fr');
  const [showLangPicker, setShowLangPicker] = useState(false);

  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState<ConvertedItem[]>([]);
  const [steps, setSteps] = useState<ConvertedItem[]>([]);
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(15);
  const [difficulty, setDifficulty] = useState('facile');
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);

  const selectedLanguage =
    LANGUAGES.find((l) => l.value === targetLang) || LANGUAGES[0];
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      title: stage === 'input' ? 'YouTube' : 'Nouvelle recette',
    });
  }, [navigation, stage]);
  const handleAnalyze = async () => {
    setUrlError('');

    if (!youtubeUrl.trim()) {
      setUrlError('Veuillez entrer une URL YouTube');
      return;
    }

    setStage('analyzing');
    setAnalysisStep(0);

    try {
      // Stage 1: Extract
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAnalysisStep(1);

      // Stage 2: Translate
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAnalysisStep(2);

      // Stage 3: Convert
      await new Promise((resolve) => setTimeout(resolve, 800));
      setAnalysisStep(3);

      const data = await mockYouTubeExtraction(youtubeUrl, targetLang);
      setTitle(data.title);
      setIngredients(data.ingredients);
      setSteps(data.steps);
      setPrepTime(data.prepTime);
      setCookTime(data.cookTime);
      setDifficulty(data.difficulty);
      setStage('edit');
    } catch (error) {
      setUrlError("Impossible de récupérer la recette. Vérifiez l'URL.");
      setStage('input');
    }
  };

  const handleCancel = () => {
    if (stage === 'edit') {
      Alert.alert(
        'Abandonner les modifications ?',
        'Toutes les modifications seront perdues.',
        [
          { text: 'Continuer', style: 'cancel' },
          {
            text: 'Abandonner',
            style: 'destructive',
            onPress: () => {
              setStage('input');
              setYoutubeUrl('');
              setTitle('');
              setIngredients([]);
              setSteps([]);
            },
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    if (!title.trim() || ingredients.length === 0 || steps.length === 0) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs requis');
      return;
    }

    Alert.alert(
      '✅ Recette sauvegardée',
      `Titre: ${title}\nIngrédients: ${ingredients.length}\nÉtapes: ${steps.length}`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { converted: '', original: '' }]);
  };

  const handleUpdateIngredient = (index: number, ingredient: ConvertedItem) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = ingredient;
    setIngredients(newIngredients);
  };

  const handleDeleteIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    setSteps([...steps, { converted: '', original: '' }]);
  };

  const handleUpdateStep = (index: number, step: ConvertedItem) => {
    const newSteps = [...steps];
    newSteps[index] = step;
    setSteps(newSteps);
  };

  const handleDeleteStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handlePrepTimePress = () => {
    Alert.prompt(
      'Temps de préparation',
      'Entrez le temps en minutes',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'OK',
          onPress: (text?:string) => {
            const time = parseInt(text || '0');
            if (!isNaN(time) && time > 0) {
              setPrepTime(time);
            }
          },
        },
      ],
      'plain-text',
      prepTime.toString()
    );
  };

  const handleCookTimePress = () => {
    Alert.prompt(
      'Temps de cuisson',
      'Entrez le temps en minutes',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'OK',
          onPress: (text?:string) => {
            const time = parseInt(text || '0');
            if (!isNaN(time) && time > 0) {
              setCookTime(time);
            }
          },
        },
      ],
      'plain-text',
      cookTime.toString()
    );
  };

  const canSave = title.trim() && ingredients.length > 0 && steps.length > 0;

  return (
    <ScrollView style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        {stage === 'input' && (
          <URLInputStage
            youtubeUrl={youtubeUrl}
            onUrlChange={setYoutubeUrl}
            targetLang={targetLang}
            onLangPress={() => setShowLangPicker(true)}
            urlError={urlError}
            onAnalyze={handleAnalyze}
          />
        )}

        {stage === 'analyzing' && (
          <AnalyzingStage
            analysisStep={analysisStep}
            selectedLanguageName={selectedLanguage.label}
          />
        )}

        {stage === 'edit' && (
          <EditRecipeStage
            title={title}
            onTitleChange={setTitle}
            ingredients={ingredients}
            onUpdateIngredient={handleUpdateIngredient}
            onDeleteIngredient={handleDeleteIngredient}
            onAddIngredient={handleAddIngredient}
            steps={steps}
            onUpdateStep={handleUpdateStep}
            onDeleteStep={handleDeleteStep}
            onAddStep={handleAddStep}
            prepTime={prepTime}
            onPrepTimePress={handlePrepTimePress}
            cookTime={cookTime}
            onCookTimePress={handleCookTimePress}
            difficulty={difficulty}
            onDifficultyPress={() => setShowDifficultyPicker(true)}
            selectedLanguageFlag={selectedLanguage.icon}
            selectedLanguageName={selectedLanguage.label}
          />
        )}
      </View>

      {/* Modals */}
      <PickerModal
        visible={showLangPicker}
        options={LANGUAGES}
        value={targetLang}
        title="Traduire en"
        onChange={setTargetLang}
        onClose={() => setShowLangPicker(false)}
      />
      <PickerModal
        visible={showDifficultyPicker}
        value={difficulty}
        onChange={setDifficulty}
        onClose={() => setShowDifficultyPicker(false)}
        options={DIFFICULTY_OPTIONS}
        title="Difficulté"
        showValidateButton={true}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOS.colors.groupedBackground,
  },
    content: {
    flex: 1,
  },
  navContent: {
    height: iOS.spacing.navBar,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: iOS.spacing.standard,
  },

  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: iOS.spacing.compact,
  },

  navButtonText: {
    ...iOS.typography.body,
    color: iOS.colors.tint,
  },

  navButtonBold: {
    fontWeight: '600',
  },

  navButtonDisabled: {
    color: iOS.colors.tertiaryLabel,
  },

  navSpacer: {
    width: 60,
  },

  navTitle: {
    ...iOS.typography.headline,
    color: iOS.colors.label,
  },

});
