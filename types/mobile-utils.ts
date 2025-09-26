import { TranslationPreviewData } from "./Recipe";

export type RootStackParamList = {
  Home: undefined;
  AddRecipe: undefined;
  RecipeDetail: { recipeId: string };
  TranslationPreview: { recipe: TranslationPreviewData };
};