
export interface ChickenCoopWithRecipesDto {
  idChickenCoop: string;
  name: string;
  description: string;
  price: number;
  availabilityStatus: string;
  recipes: RecipeDto[];
}

export interface RecipeDto {
  idRecipe: string;
  description: string;
  amount: number;
  recipeDetail: RecipeDetailDto[];
}

export interface RecipeDetailDto {
  idRecipeDetail: string;
  componentQuantity: number;
  component: ComponentDto;
}

export interface ComponentDto {
  idComponent: string;
  name: string;
  description: string;
  category: string;
}
