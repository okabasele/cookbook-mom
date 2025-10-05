import { Recipe } from "@/types/Recipe";
import { deleteRecipe, saveAllRecipes, saveRecipe } from "@/utils/storage";

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
        createdAt: new Date(Date.now()).toISOString(), // Today
        isOriginal: true,
        translationIds: []
    },
    {
        id: '2',
        title: 'Tacos 2 viandes',
        ingredients: [
            '500g pork shoulder, thinly sliced',
           
        ],
        steps: [
            'Marinate the pork with achiote paste, chili powder, cumin, oregano, garlic, and orange juice for at least 1 hour.',
      ],
        detectedLanguage: 'en',
        createdAt: new Date(Date.now()).toISOString(), // Today
        isOriginal: true,
        translationIds: []
    },
    {
        id: '3',
        title: 'Tacos al Pastor',
        ingredients: [
            '500g pork shoulder, thinly sliced',
        ],
        steps: [
            'Marinate.',
        ],
        detectedLanguage: 'en',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        isOriginal: true,
        translationIds: []
    },
    {
        id: '4',
        title: 'Chicken Curry',
        ingredients: [
            '500g chicken breast',

        ],
        steps: [
            'Cook.',
  ],
        detectedLanguage: 'en',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), // Last 7 days
        isOriginal: true,
        translationIds: []
    },
    {
        id: '5',
        title: 'Beef Stroganoff',
        ingredients: [
            '500g beef strips',

        ],
        steps: [
            'Cook',
    ],
        detectedLanguage: 'en',
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString(), // Last 30 days
        isOriginal: true,
        translationIds: []
    },
    {
        id: '6',
        title: 'Apple Pie',
        ingredients: [
            '2 cups flour',
        ],
        steps: [
            'Prepare the pie crust by mixing flour, butter, and sugar.',
        ],
        detectedLanguage: 'en',
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(), // Older
        isOriginal: true,
        translationIds: []
    },
];

export const seedRecipes = async () => {
    try {
          console.log('Seeding recipes...');
        await saveAllRecipes(recipes);
        console.log('Recipes seeded successfully');
    } catch (error) {
        console.error('Error seeding recipes:', error);
    }
};