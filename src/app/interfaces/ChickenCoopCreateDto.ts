export interface ChickenCoopCreateDto {
  name: string;
  description: string;
  recipes: RecipeCreateDto[];
}

export interface RecipeCreateDto {
  
  description: string;
  amount: number;
  details: RecipeDetailCreateDto[];
}

export interface RecipeDetailCreateDto {
  componentId: string;
  componentQuantity: number;
}
