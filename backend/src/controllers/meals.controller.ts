import { createManyIngredient, findIngredientByNames } from "../services/ingredients.service";
import ApiError from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";
import * as _ from "lodash";
import { ingredientsExtractor } from "../utils/ingredientsExtractor";
import { createManyTrIngredients } from "../services/trIngredients.service";
import { createManyMeals, findMeal, findUser } from "../services/meals.service";
import httpStatus from "http-status";

export const getMealIngeredientsByMealId = catchAsync(async (c) => {
  const mealId = c.req.param('mealId');
  const meal = await findMeal({ id: mealId });

  if (_.isEmpty(meal)) {
    return c.json({ data: meal });
  }

  return c.json({ data: meal });
});

export const findMealByExternalId = catchAsync(async (c) => {
  const externalId = c.req.param('externalId');
  const meal = await findMeal({ id: externalId, external_id: externalId });


  if (_.isEmpty(meal)) {
    const response = await fetch(`${process.env.MEAL_DB_API}/lookup.php?i=${externalId}`);

    if (!response.ok) {
      throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, { message: "Failed to fetch data from MEAL_DB_API" });
    }
    const { meals } = await response.json();

    const mealsData = await createManyMeals({ data: _.map(meals, (item) => ({ external_id: item?.idMeal })) });

    // get ingridients
    const { ingredientsNames } = ingredientsExtractor(meals[0]);

    const ingredients = await findIngredientByNames({ names: ingredientsNames });

    // filter ingredients 
    const ingeredientsData = _.filter(ingredientsNames, (name) => !_.some(ingredients, { name: name?.replace(/,|-/g, " ") }));


    if (!_.isEmpty(ingeredientsData)) {

      const joinedIngredientsName = ingeredientsData.join(",").replace(/,|-/g, " ");

      const responseCalorie = await fetch(`${process.env.CALORIE_NINJA_API}/nutrition?query=${joinedIngredientsName}`, {
        method: 'GET',
        headers: {
          'X-Api-Key': process.env.CALORIE_NINJA_API_KEY || ""
        }
      });

      if (!responseCalorie.ok) {
        throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, { message: "Failed to fetch data from CALORIE NINJA" });
      }
      const { items } = await responseCalorie.json();

      const result = await createManyIngredient({ data: items });
      const mealId = _.find(mealsData, (item) => item.external_id === externalId)?.id;
      const combinedIngredients = _.concat(ingredients, result);

      if (mealId) {
        await createManyTrIngredients({ data: _.map(combinedIngredients, (item) => ({ calorie_id: item.id, meal_id: mealId, measure: "" })) });
      }
    }
    const mealNew = await findMeal({ id: externalId, external_id: externalId });

    return c.json({ data: mealNew });

  }
  return c.json({ data: meal });
});

export const findMealBookmark = catchAsync(async ctx => {
  const externalId = ctx.req.param("externalId");
  const data = await findUser(externalId);
  return ctx.json({ data });
});
