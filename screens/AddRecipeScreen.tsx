import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { detectLanguage } from '../utils/translation';
import { theme, commonStyles } from '../styles/theme';
import { LanguagePicker } from '../components/LanguagePicker';
import { useRouter } from 'expo-router';

interface FormData {
  title: string;
  ingredients: string;
  steps: string;
}

export function AddRecipeScreen() {
  const navigation = useRouter();
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const [detectedLanguage, setDetectedLanguage] = useState<'en' | 'fr'>('en');
  const [confidence, setConfidence] = useState(0);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const watchedFields = watch();

  useEffect(() => {
    const allText = [watchedFields.title, watchedFields.ingredients, watchedFields.steps]
      .filter(Boolean)
      .join(' ');
    
    if (allText.length > 10) {
      const detection = detectLanguage(allText);
      setDetectedLanguage(detection.language);
      setConfidence(detection.confidence);
    }
  }, [watchedFields]);

  const validateForm = (data: FormData) => {
    if (!data.title?.trim()) {
      Alert.alert('Erreur', 'Le titre de la recette est requis');
      return false;
    }
    if (!data.ingredients?.trim()) {
      Alert.alert('Erreur', 'Les ingrédients sont requis');
      return false;
    }
    if (!data.steps?.trim()) {
      Alert.alert('Erreur', 'Les étapes sont requises');
      return false;
    }
    return true;
  };

  const onSaveOriginal = async (data: FormData) => {
    if (!validateForm(data)) return;
    
    try {
      setIsProcessing(true);
      // navigation.navigate('Home');
      navigation.replace('/(tabs)/index')
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder la recette');
    } finally {
      setIsProcessing(false);
    }
  };

  const onTranslate = (data: FormData) => {
    if (!validateForm(data)) return;
    
    setIsProcessing(true);
    // navigation.navigate('TranslationPreview', {
    //   recipe: {
    //     title: data.title,
    //     ingredients: data.ingredients.split('\n').filter(Boolean),
    //     steps: data.steps.split('\n').filter(Boolean),
    //     detectedLanguage
    //   }
    // });
    setIsProcessing(false);
  };

  const getConfidenceText = () => {
    if (confidence > 0.8) return 'Confiance élevée';
    if (confidence > 0.5) return 'Confiance moyenne';
    return 'Vérifiez SVP';
  };

  const getConfidenceColor = () => {
    if (confidence > 0.8) return theme.colors.success;
    if (confidence > 0.5) return theme.colors.warning;
    return theme.colors.danger;
  };

  return (
    <KeyboardAvoidingView 
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.headerText}>
            Ajoutez votre recette et nous détecterons automatiquement la langue!
          </Text>

          <Controller
            control={control}
            name="title"
            rules={{ required: 'Le titre est requis' }}
            render={({ field }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Titre de la recette *</Text>
                <TextInput
                  style={[commonStyles.input, errors.title && styles.inputError]}
                  placeholder="Ex: Chocolate Chip Cookies"
                  value={field.value || ''}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholderTextColor={theme.colors.textSecondary}
                />
                {errors.title && (
                  <Text style={styles.errorText}>{errors.title.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="ingredients"
            rules={{ required: 'Les ingrédients sont requis' }}
            render={({ field }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ingrédients (un par ligne) *</Text>
                <TextInput
                  style={[commonStyles.input, commonStyles.textArea, errors.ingredients && styles.inputError]}
                  placeholder="2 cups flour&#10;1 cup sugar&#10;1/2 cup butter"
                  multiline
                  numberOfLines={6}
                  value={field.value || ''}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholderTextColor={theme.colors.textSecondary}
                />
                {errors.ingredients && (
                  <Text style={styles.errorText}>{errors.ingredients.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="steps"
            rules={{ required: 'Les étapes sont requises' }}
            render={({ field }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Étapes (une par ligne) *</Text>
                <TextInput
                  style={[commonStyles.input, commonStyles.textArea, errors.steps && styles.inputError]}
                  placeholder="Mix dry ingredients&#10;Cream butter and sugar&#10;Bake at 350°F for 12 minutes"
                  multiline
                  numberOfLines={6}
                  value={field.value || ''}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholderTextColor={theme.colors.textSecondary}
                />
                {errors.steps && (
                  <Text style={styles.errorText}>{errors.steps.message}</Text>
                )}
              </View>
            )}
          />

          {/* Language Detection Display */}
          <View style={styles.languageDetection}>
            <Text style={styles.detectionLabel}>Langue détectée:</Text>
            <View style={styles.detectionResult}>
              <Text style={styles.detectionText}>
                {detectedLanguage === 'en' ? '🇺🇸 English' : '🇫🇷 Français'}
              </Text>
              <Text style={[styles.confidenceText, { color: getConfidenceColor() }]}>
                {getConfidenceText()}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editLanguageButton}
              onPress={() => setShowLanguagePicker(true)}
            >
              <Text style={styles.editLanguageText}>Modifier</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[commonStyles.button, commonStyles.primaryButton, isProcessing && styles.disabledButton]}
              onPress={handleSubmit(onSaveOriginal)}
              disabled={isProcessing}
            >
              <Text style={commonStyles.buttonText}>
                💾 Sauvegarder en {detectedLanguage === 'en' ? 'Anglais' : 'Français'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[commonStyles.button, commonStyles.secondaryButton, isProcessing && styles.disabledButton]}
              onPress={handleSubmit(onTranslate)}
              disabled={isProcessing}
            >
              <Text style={commonStyles.buttonText}>
                🌍 Traduire vers {detectedLanguage === 'en' ? 'Français' : 'Anglais'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <LanguagePicker
        visible={showLanguagePicker}
        onClose={() => setShowLanguagePicker(false)}
        onSelect={(languageCode) => {
          setDetectedLanguage(languageCode);
          setConfidence(0.9); // Manual selection = high confidence
        }}
        title="Corriger la langue détectée"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  
  headerText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    fontStyle: 'italic',
  },
  
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  
  label: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  inputError: {
    borderColor: theme.colors.danger,
  },
  
  errorText: {
    ...theme.typography.captionSmall,
    color: theme.colors.danger,
    marginTop: theme.spacing.xs,
  },
  
  languageDetection: {
    backgroundColor: theme.colors.gray50,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  
  detectionLabel: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  detectionResult: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  detectionText: {
    ...theme.typography.bodyLarge,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  
  confidenceText: {
    ...theme.typography.captionSmall,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  
  editLanguageButton: {
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  
  editLanguageText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  
  actionButtons: {
    gap: theme.spacing.md,
  },
  
  disabledButton: {
    opacity: 0.6,
  },
});