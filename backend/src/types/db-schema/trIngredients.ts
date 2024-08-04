import { tr_ingredients } from "@prisma/client";

export type trIngredientTypes = Partial<tr_ingredients>;
export type trIngredientTypesMandatory = Pick<tr_ingredients, "calorie_id" | "meal_id" | "measure">;