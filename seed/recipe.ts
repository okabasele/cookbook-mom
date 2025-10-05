import { Recipe } from "@/types/Recipe";
import { saveRecipe } from "@/utils/storage";

const recipes: Recipe[] = [
    {
        id: '1',
        title: 'Spaghetti Carbonara',
        ingredients: [
            '200g spaghetti',
            '100g pancetta',
            '2 large eggs',
            '50g pecorino cheese',
            '50g parmesan cheese',
            '2 cloves garlic',
            'Salt and black pepper'
        ],
        steps: [
            'Cook the spaghetti in a large pot of boiling salted water until al dente.',
            'In a pan, cook the pancetta with the garlic until crispy. Remove garlic and discard.',
            'In a bowl, beat the eggs and mix in the cheeses.',
            'Drain the pasta and add it to the pan with pancetta. Remove from heat.',
            'Quickly pour in the egg and cheese mixture, stirring vigorously to create a creamy sauce.',
            'Season with salt and black pepper to taste. Serve immediately.'
        ],
        detectedLanguage: 'en',
        createdAt: new Date().toISOString(),
        isOriginal: true,
        translationIds: []
    },
    {
        id: '2',
        title: 'Tacos al Pastor',
        ingredients: [
            '500g pork shoulder, thinly sliced',
            '100g pineapple, diced',
            '2 tbsp achiote paste',
            '1 tbsp chili powder',
            '1 tsp cumin',
            '1 tsp oregano',
            '2 cloves garlic, minced',
            '1/4 cup orange juice',
        ],
        steps: [
            'Marinate the pork with achiote paste, chili powder, cumin, oregano, garlic, and orange juice for at least 1 hour.',
            'Cook the marinated pork in a hot skillet until browned and cooked through.',
            'Warm the tortillas and fill them with the pork and diced pineapple.',
            'Serve with your favorite toppings, such as cilantro, onions, and lime.'
        ],
        detectedLanguage: 'en',
        createdAt: new Date().toISOString(),
        isOriginal: true,
        translationIds: []
    }
]

export const seedRecipes = async () => {
    try {
        await Promise.all(recipes.map(r => saveRecipe(r)));
        console.log('Recipes seeded successfully');
    } catch (error) {
        console.error('Error seeding recipes:', error);
    }
}