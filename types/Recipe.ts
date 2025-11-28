export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  detectedLanguage: LanguageAvailable;
  sourceUrl?: string;
  createdAt: string;
  
  // Translation relationships
  isOriginal?: boolean;
  originalRecipeId?: string;    // null if isOriginal=true
  translationIds?: string[];     // IDs of translations
}

export type LanguageAvailable = 'en' | 'fr';

export interface LanguageOption {
  code: LanguageAvailable;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];