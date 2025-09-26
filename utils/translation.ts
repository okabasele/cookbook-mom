import { TranslationPreviewData, MockTranslation } from '../types/Recipe';

// Mock translation service - replace with real LLM API later
export const translateRecipe = async (recipe: TranslationPreviewData): Promise<MockTranslation> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const targetLanguage = recipe.detectedLanguage === 'en' ? 'fr' : 'en';
  
  // Simple mock translations
  const translations = {
    en: {
      titles: {
        'Cookies aux Pépites de Chocolat': 'Chocolate Chip Cookies',
        'Tarte aux Pommes': 'Apple Pie',
        'Soupe à l\'Oignon': 'French Onion Soup',
        'Pain Français': 'French Bread',
        'Crêpes': 'French Crepes'
      },
      ingredients: [
        { from: 'tasse', to: 'cup' },
        { from: 'cuillère à soupe', to: 'tablespoon' },
        { from: 'cuillère à café', to: 'teaspoon' },
        { from: 'farine', to: 'flour' },
        { from: 'sucre', to: 'sugar' },
        { from: 'beurre', to: 'butter' },
        { from: 'œuf', to: 'egg' },
        { from: 'œufs', to: 'eggs' },
        { from: 'lait', to: 'milk' },
        { from: 'chocolat', to: 'chocolate' },
        { from: 'vanille', to: 'vanilla' },
        { from: 'pomme', to: 'apple' },
        { from: 'pommes', to: 'apples' }
      ],
      steps: [
        { from: 'mélanger', to: 'mix' },
        { from: 'cuire au four', to: 'bake' },
        { from: 'préchauffer', to: 'preheat' },
        { from: 'ajouter', to: 'add' },
        { from: 'battre', to: 'beat' },
        { from: 'incorporer', to: 'fold in' },
        { from: 'minutes', to: 'minutes' },
        { from: 'degrés', to: 'degrees' }
      ]
    },
    fr: {
      titles: {
        'Chocolate Chip Cookies': 'Cookies aux Pépites de Chocolat',
        'Apple Pie': 'Tarte aux Pommes',
        'French Onion Soup': 'Soupe à l\'Oignon',
        'French Bread': 'Pain Français',
        'French Crepes': 'Crêpes'
      },
      ingredients: [
        { from: 'cup', to: 'tasse' },
        { from: 'tablespoon', to: 'cuillère à soupe' },
        { from: 'teaspoon', to: 'cuillère à café' },
        { from: 'flour', to: 'farine' },
        { from: 'sugar', to: 'sucre' },
        { from: 'butter', to: 'beurre' },
        { from: 'egg', to: 'œuf' },
        { from: 'eggs', to: 'œufs' },
        { from: 'milk', to: 'lait' },
        { from: 'chocolate', to: 'chocolat' },
        { from: 'vanilla', to: 'vanille' },
        { from: 'apple', to: 'pomme' },
        { from: 'apples', to: 'pommes' }
      ],
      steps: [
        { from: 'mix', to: 'mélanger' },
        { from: 'bake', to: 'cuire au four' },
        { from: 'preheat', to: 'préchauffer' },
        { from: 'add', to: 'ajouter' },
        { from: 'beat', to: 'battre' },
        { from: 'fold in', to: 'incorporer' },
        { from: 'minutes', to: 'minutes' },
        { from: 'degrees', to: 'degrés' }
      ]
    }
  };
  
  const translationMap = translations[targetLanguage];
  
  // Translate title
  let translatedTitle = recipe.title;
  if (translationMap.titles[recipe.title]) {
    translatedTitle = translationMap.titles[recipe.title];
  } else {
    // Basic fallback translation for unknown titles
    translatedTitle = targetLanguage === 'fr' 
      ? `Recette de ${recipe.title}` 
      : `Recipe for ${recipe.title}`;
  }
  
  // Translate ingredients
  const translatedIngredients = recipe.ingredients.map(ingredient => {
    let translated = ingredient.toLowerCase();
    translationMap.ingredients.forEach(({ from, to }) => {
      const regex = new RegExp(`\\b${from}\\b`, 'gi');
      translated = translated.replace(regex, to);
    });
    return translated.charAt(0).toUpperCase() + translated.slice(1);
  });
  
  // Translate steps
  const translatedSteps = recipe.steps.map(step => {
    let translated = step.toLowerCase();
    translationMap.steps.forEach(({ from, to }) => {
      const regex = new RegExp(`\\b${from}\\b`, 'gi');
      translated = translated.replace(regex, to);
    });
    return translated.charAt(0).toUpperCase() + translated.slice(1);
  });
  
  return {
    title: translatedTitle,
    ingredients: translatedIngredients,
    steps: translatedSteps,
    targetLanguage
  };
};

export const detectLanguage = (text: string): { language: 'en' | 'fr', confidence: number } => {
  const englishKeywords = [
    'cup', 'tablespoon', 'teaspoon', 'flour', 'sugar', 'bake', 'oven', 'mix', 
    'butter', 'egg', 'milk', 'chocolate', 'vanilla', 'preheat', 'minutes',
    'ingredients', 'recipe', 'cooking', 'preparation', 'the', 'and', 'with'
  ];
  
  const frenchKeywords = [
    'tasse', 'cuillère', 'farine', 'sucre', 'cuire', 'four', 'mélanger',
    'beurre', 'œuf', 'lait', 'chocolat', 'vanille', 'préchauffer', 'minutes',
    'ingrédients', 'recette', 'cuisine', 'préparation', 'le', 'la', 'et', 'avec'
  ];
  
  const textLower = text.toLowerCase();
  
  const englishScore = englishKeywords.filter(keyword => 
    textLower.includes(keyword)
  ).length;
  
  const frenchScore = frenchKeywords.filter(keyword => 
    textLower.includes(keyword)
  ).length;
  
  const totalWords = text.split(/\s+/).length;
  
  if (englishScore > frenchScore) {
    const confidence = Math.min(0.9, 0.3 + (englishScore / totalWords) * 2);
    return { language: 'en', confidence };
  } else if (frenchScore > englishScore) {
    const confidence = Math.min(0.9, 0.3 + (frenchScore / totalWords) * 2);
    return { language: 'fr', confidence };
  } else {
    return { language: 'en', confidence: 0.3 };
  }
};