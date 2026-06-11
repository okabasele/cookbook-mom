import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import iOS from '../styles/ios';
import { URLInputStage } from './stages/URLInputStage';
import { AnalyzingStage } from './stages/AnalyzingStage';
import { EditRecipeStage } from './stages/EditRecipeStage';
import { mockYouTubeExtraction } from '../utils/conversions';
import PickerModal from '@/components/ui/PickerModal';
import { NavButton } from '@/components/ui/NavButton';
import { saveRecipe } from '@/utils/storage';
import { LanguageAvailable, Recipe } from '@/types/Recipe';
import { retrieveYoutubeVideoRecipe } from '@/services/youtube.service';

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
  const [stage, setStage] = useState<Stage>('input');
  const [analysisStep, setAnalysisStep] = useState(0); // 0: Extract, 1: Translate, 2: Convert

  // Form data
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [targetLang, setTargetLang] = useState<LanguageAvailable>('fr');
  const [showLangPicker, setShowLangPicker] = useState(false);

  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(15);
  const [difficulty, setDifficulty] = useState('easy');
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);

  const selectedLanguage =
    LANGUAGES.find((l) => l.value === targetLang) || LANGUAGES[0];
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      title: stage === 'input' ? 'YouTube' : 'Nouvelle recette',
      headerRight: () => (
        <NavButton
          onPress={handleSave}
          label="Sauvegarder"
          disabled={!canSave}
        />
      ),
      headerLeft: () => <NavButton onPress={handleCancel} label="Annuler" disabled={stage === 'input'} />,
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
          // const testData = await retrieveYoutubeVideoRecipe(youtubeUrl, targetLang);
// console.log({ testData });
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
    const recipe: Recipe = {
      title,
      ingredients: ingredients,
      steps: steps,
      id: Date.now().toString(),
      detectedLanguage: 'fr',
      createdAt: new Date().toISOString(),
      sourceUrl: youtubeUrl,
      }
    saveRecipe(recipe)
    Alert.alert(
      '✅ Recette sauvegardée',
      `Titre: ${title}\nIngrédients: ${ingredients.length}\nÉtapes: ${steps.length}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setAnalysisStep(0);
            setStage('input');
            setYoutubeUrl('');
            setTitle('');
            setIngredients([]);
            setSteps([]);
            setPrepTime(0);
            setCookTime(0);
            setDifficulty('easy');
            router.replace(`/recipe-detail/${recipe.id}`)
          },
        },
      ]
    );
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleUpdateIngredient = (index: number, ingredient: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = ingredient;
    setIngredients(newIngredients);
  };

  const handleDeleteIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleUpdateStep = (index: number, step: string) => {
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
          onPress: (text?: string) => {
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
          onPress: (text?: string) => {
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

  const canSave =
    title.trim().length > 0 && ingredients.length > 0 && steps.length > 0;

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
        onChange={(value: string) => setTargetLang(value as LanguageAvailable)}
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

  navSpacer: {
    width: 60,
  },

  navTitle: {
    ...iOS.typography.headline,
    color: iOS.colors.label,
  },
});
