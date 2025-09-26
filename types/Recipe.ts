export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  detectedLanguage: 'en' | 'fr';
  sourceUrl?: string;
  createdAt: string;
  
  // Translation relationships
  isOriginal: boolean;
  originalRecipeId?: string;    // null if isOriginal=true
  translationIds: string[];     // IDs of translations
}

export interface LanguageOption {
  code: 'en' | 'fr';
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

export interface TranslationPreviewData {
  title: string;
  ingredients: string[];
  steps: string[];
  detectedLanguage: 'en' | 'fr';
}

export interface MockTranslation {
  title: string;
  ingredients: string[];
  steps: string[];
  targetLanguage: 'en' | 'fr';
}