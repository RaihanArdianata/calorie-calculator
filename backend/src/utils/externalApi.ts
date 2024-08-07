import httpStatus = require("http-status");
import ApiError from "./ApiError";
import { createManyMeals } from "../services/meals.service";
import { ingredientsExtractor } from "./ingredientsExtractor";
import { createManyIngredient, findIngredientByNames } from "../services/ingredients.service";
import * as _ from "lodash";
import { createManyTrIngredients } from "../services/trIngredients.service";

export const fetchExternalApi = async ({ mealId }: { mealId: string; }) => {

  const response = await fetch(`${process.env["MEAL_DB_API"]}/lookup.php?i=${mealId}`);

  if (!response.ok) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, { message: "Failed to fetch data from MEAL_DB_API" });
  }
  const { meals }: any = await response.json();

  const mealsData = await createManyMeals({ data: _.map(meals, (item) => ({ external_id: item?.idMeal, name: item?.strMeal, area: item?.strArea })) });

  // get ingridients
  const { ingredientsNames } = ingredientsExtractor(meals[0]);

  const ingredients = await findIngredientByNames({ names: ingredientsNames });

  // filter ingredients 
  const ingeredientsData = _.filter(ingredientsNames, (name) => !_.some(ingredients, { name: name?.replace(/,|-/g, " ") }));


  if (!_.isEmpty(ingeredientsData)) {

    const joinedIngredientsName = ingeredientsData.join(",").replace(/,|-/g, " ");

    const responseCalorie = await fetch(`${process.env["CALORIE_NINJA_API"]}/nutrition?query=${joinedIngredientsName}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': process.env["CALORIE_NINJA_API_KEY"] || ""
      }
    });

    if (!responseCalorie.ok) {
      throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, { message: "Failed to fetch data from CALORIE NINJA" });
    }
    const { items }: any = await responseCalorie.json();

    const result = await createManyIngredient({ data: items });
    const meal_Id = _.find(mealsData, (item) => item.external_id === mealId)?.id;
    const combinedIngredients = _.concat(ingredients, result);

    if (meal_Id) {
      await createManyTrIngredients({ data: _.map(combinedIngredients, (item) => ({ calorie_id: item.id, meal_id: meal_Id, measure: "" })) });
    }
  }
  await findIngredientByNames({ names: ingredientsNames });

  return true;
};