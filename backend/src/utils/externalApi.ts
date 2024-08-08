import httpStatus = require("http-status");
import ApiError from "./ApiError";
import { createManyMeals } from "../services/meals.service";
import { createManyIngredient, findIngredientByNames } from "../services/ingredients.service";
import * as _ from 'lodash';
import { createManyTrIngredients } from "../services/trIngredients.service";
import { totalPortions } from "./formula";
import { ingredientsExtractor } from "./ingredientsExtractor";


export const fetchAndCreateMeal = async (externalId: string) => {
  const response = await fetch(`${process.env["MEAL_DB_API"]}/lookup.php?i=${externalId}`);

  if (!response.ok) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, { message: "Failed to fetch data from MEAL_DB_API" });
  }

  const { meals }: any = await response.json();

  const { ingredientsNames } = await ingredientsExtractor(meals[0]);

  const insertedData = await createManyMeals({
    data: _.map(meals, (item) => ({
      external_id: item?.idMeal,
      name: item?.strMeal,
      area: item?.strArea,
      total_portions: totalPortions(_.isEmpty(ingredientsNames) ? 0 : ingredientsNames.length),
    })),
  });

  return { meals, insertedData };
};

export const fetchAndCreateIngredients = async (ingredientsNames: string[], mealId: string) => {
  const ingredients = await findIngredientByNames({ names: ingredientsNames });

  const ingredientsData = _.filter(ingredientsNames, (name) => !_.some(ingredients, { name: name?.replace(/,|-/g, " ") }));



  if (!_.isEmpty(ingredientsData)) {
    const joinedIngredientsName = ingredientsData.join(",").replace(/,|-/g, " ");

    const responseCalorie = await fetch(`${process.env["CALORIE_NINJA_API"]}/nutrition?query=${joinedIngredientsName}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': process.env["CALORIE_NINJA_API_KEY"] || "",
      },
    });

    if (!responseCalorie.ok) {
      throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, { message: "Failed to fetch data from CALORIE NINJA" });
    }

    const { items }: any = await responseCalorie.json();
    const result = await createManyIngredient({ data: items });
    const combinedIngredients = _.concat(ingredients, result);

    console.log(ingredients, '-----ingredientsData-----', mealId);
    if (mealId) {
      await createManyTrIngredients({
        data: _.map(combinedIngredients, (item) => ({
          calorie_id: item.id,
          meal_id: mealId,
          measure: "",
        })),
      });
    }
  }

  const ingredientsResult = await findIngredientByNames({ names: ingredientsNames });
  return ingredientsResult;
};