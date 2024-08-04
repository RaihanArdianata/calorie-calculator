import * as _ from "lodash";
import { MealDBTypes } from "../types/mealDB";


export const ingredientsExtractor = (meals: MealDBTypes) => {
  const ingredientKeys: (keyof MealDBTypes)[] = _.map(_.range(1, 21), (i) => `strIngredient${i}` as keyof MealDBTypes);

  const ingredientsNames = _.compact(ingredientKeys.map((key: keyof MealDBTypes) => {
    const value = meals[key];
    return typeof value === 'string' ? value : "";
  }));

  return { ingredientsNames };
};