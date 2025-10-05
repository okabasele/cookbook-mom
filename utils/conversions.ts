// ===========================
// 🧮 CONVERSION SYSTEM
// ===========================

interface Conversion {
  value: number;
  unit: string;
  ingredient?: string;
}

const CONVERSIONS: { [key: string]: Conversion | ((temp: number) => number) } = {
  // Volume to weight (context-specific)
  'cup flour': { value: 120, unit: 'g', ingredient: 'farine' },
  'cup sugar': { value: 200, unit: 'g', ingredient: 'sucre' },
  'cup butter': { value: 225, unit: 'g', ingredient: 'beurre' },
  'cup brown sugar': { value: 220, unit: 'g', ingredient: 'cassonade' },

  // Generic volume
  'cup': { value: 240, unit: 'ml' },
  'tablespoon': { value: 15, unit: 'ml' },
  'tbsp': { value: 15, unit: 'ml' },
  'teaspoon': { value: 5, unit: 'ml' },
  'tsp': { value: 5, unit: 'ml' },

  // Temperature
  'fahrenheit': (f: number) => Math.round((f - 32) * 5 / 9),
};

export const convertIngredient = (text: string): { converted: string; original: string } => {
  // Extract quantity and unit
  const match = text.match(/(\d+(?:\/\d+)?|\d+\.\d+)\s*(cups?|tablespoons?|tbsps?|teaspoons?|tsps?)\s+(.+)/i);

  if (!match) return { converted: text, original: text };

  const [, qty, unit, ingredient] = match;

  // Convert fractions like "3/4" to decimal
  let amount: number;
  if (qty.includes('/')) {
    const [numerator, denominator] = qty.split('/').map(Number);
    amount = numerator / denominator;
  } else {
    amount = parseFloat(qty);
  }

  const unitLower = unit.toLowerCase().replace(/s$/, '');

  // Try context-specific conversion first
  const ingredientLower = ingredient.toLowerCase();
  for (const [key, conversion] of Object.entries(CONVERSIONS)) {
    if (typeof conversion === 'function') continue;

    if (key.includes(unitLower) && ingredientLower.includes(key.split(' ')[1])) {
      const convertedAmount = Math.round(amount * conversion.value);
      return {
        converted: `${convertedAmount}${conversion.unit} de ${conversion.ingredient}`,
        original: text
      };
    }
  }

  // Generic conversion
  const conversion = CONVERSIONS[unitLower];
  if (conversion && typeof conversion !== 'function') {
    const convertedAmount = Math.round(amount * conversion.value);
    return {
      converted: `${convertedAmount}${conversion.unit} ${ingredient}`,
      original: text
    };
  }

  return { converted: text, original: text };
};

export const convertTemperature = (text: string): string => {
  return text.replace(/(\d+)\s*°?F/gi, (match, temp) => {
    const conversion = CONVERSIONS.fahrenheit;
    if (typeof conversion === 'function') {
      const celsius = conversion(parseInt(temp));
      return `${celsius}°C`;
    }
    return match;
  });
};

// Mock API for YouTube extraction
export const mockYouTubeExtraction = async (
  url: string,
  targetLang: string
): Promise<{
  title: string;
  language: string;
  ingredients: { converted: string; original: string }[];
  steps: { converted: string; original: string }[];
  prepTime: number;
  cookTime: number;
  difficulty: string;
}> => {
  // Simulate delays for 3 stages
  await new Promise(resolve => setTimeout(resolve, 1000)); // Extract
  await new Promise(resolve => setTimeout(resolve, 1000)); // Translate
  await new Promise(resolve => setTimeout(resolve, 800));  // Convert

  if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
    throw new Error('URL invalide');
  }

  // Mock data (already translated to French if targetLang === 'fr')
  const data = {
    title: targetLang === 'fr' ? "Cookies aux Pépites de Chocolat" : "Chocolate Chip Cookies",
    language: targetLang,
    ingredients: targetLang === 'fr' ? [
      { converted: "240g de farine tout usage", original: "2 cups all-purpose flour" },
      { converted: "225g de beurre ramolli", original: "1 cup butter, softened" },
      { converted: "150g de sucre blanc", original: "3/4 cup granulated sugar" },
      { converted: "165g de cassonade", original: "3/4 cup brown sugar" },
      { converted: "2 gros œufs", original: "2 large eggs" },
      { converted: "10ml d'extrait de vanille", original: "2 tsp vanilla extract" },
      { converted: "5ml de bicarbonate de soude", original: "1 tsp baking soda" },
      { converted: "350g de pépites de chocolat", original: "2 cups chocolate chips" }
    ] : [
      { converted: "2 cups all-purpose flour", original: "2 cups all-purpose flour" },
      { converted: "1 cup butter, softened", original: "1 cup butter, softened" },
      { converted: "3/4 cup granulated sugar", original: "3/4 cup granulated sugar" },
      { converted: "3/4 cup brown sugar", original: "3/4 cup brown sugar" },
      { converted: "2 large eggs", original: "2 large eggs" },
      { converted: "2 tsp vanilla extract", original: "2 tsp vanilla extract" },
      { converted: "1 tsp baking soda", original: "1 tsp baking soda" },
      { converted: "2 cups chocolate chips", original: "2 cups chocolate chips" }
    ],
    steps: targetLang === 'fr' ? [
      { converted: "Préchauffer le four à 190°C", original: "Preheat oven to 375°F" },
      { converted: "Mélanger le beurre et les sucres jusqu'à obtenir une texture crémeuse", original: "Mix butter and sugars until creamy" },
      { converted: "Incorporer les œufs et la vanille en battant", original: "Beat in eggs and vanilla" },
      { converted: "Mélanger la farine et le bicarbonate de soude", original: "Combine flour and baking soda" },
      { converted: "Incorporer progressivement les ingrédients secs", original: "Gradually blend dry ingredients" },
      { converted: "Ajouter les pépites de chocolat en remuant", original: "Stir in chocolate chips" },
      { converted: "Déposer des cuillères bombées sur des plaques", original: "Drop rounded tablespoons onto sheets" },
      { converted: "Cuire 9-11 minutes jusqu'à dorure", original: "Bake 9-11 minutes until golden" }
    ] : [
      { converted: "Preheat oven to 375°F", original: "Preheat oven to 375°F" },
      { converted: "Mix butter and sugars until creamy", original: "Mix butter and sugars until creamy" },
      { converted: "Beat in eggs and vanilla", original: "Beat in eggs and vanilla" },
      { converted: "Combine flour and baking soda", original: "Combine flour and baking soda" },
      { converted: "Gradually blend dry ingredients", original: "Gradually blend dry ingredients" },
      { converted: "Stir in chocolate chips", original: "Stir in chocolate chips" },
      { converted: "Drop rounded tablespoons onto sheets", original: "Drop rounded tablespoons onto sheets" },
      { converted: "Bake 9-11 minutes until golden", original: "Bake 9-11 minutes until golden" }
    ],
    prepTime: 15,
    cookTime: 11,
    difficulty: 'facile'
  };

  return data;
};
