// Mock API for YouTube extraction
export const mockYouTubeExtraction = async (
  url: string,
  targetLang: string
): Promise<{
  title: string;
  language: string;
  ingredients: string[];
  steps: string[];
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
      "240g de farine tout usage",
      "225g de beurre ramolli",
      "150g de sucre blanc",
      "165g de cassonade",
      "2 gros œufs",
      "10ml d'extrait de vanille",
      "5ml de bicarbonate de soude",
      "350g de pépites de chocolat"
    ] : [
      "2 cups all-purpose flour",
      "1 cup butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "1 tsp baking soda",
      "2 cups chocolate chips"
    ],
    steps: targetLang === 'fr' ? [
      "Préchauffer le four à 190°C",
      "Mélanger le beurre et les sucres jusqu'à obtenir une texture crémeuse",
      "Incorporer les œufs et la vanille en battant",
      "Mélanger la farine et le bicarbonate de soude",
      "Incorporer progressivement les ingrédients secs",
      "Ajouter les pépites de chocolat en remuant",
      "Déposer des cuillères bombées sur des plaques",
      "Cuire 9-11 minutes jusqu'à dorure"
    ] : [
      "Preheat oven to 375°F",
      "Mix butter and sugars until creamy",
      "Beat in eggs and vanilla",
      "Combine flour and baking soda",
      "Gradually blend dry ingredients",
      "Stir in chocolate chips",
      "Drop rounded tablespoons onto sheets",
      "Bake 9-11 minutes until golden"
    ],
    prepTime: 15,
    cookTime: 11,
    difficulty: 'facile'
  };

  return data;
};
