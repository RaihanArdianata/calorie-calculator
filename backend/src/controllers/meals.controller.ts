import { createManyIngredient, findIngredientByNames } from "../services/ingredients.service";
import ApiError from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";
import * as _ from "lodash";
import { ingredientsExtractor } from "../utils/ingredientsExtractor";
import { createManyTrIngredients, find } from "../services/trIngredients.service";
import { createManyMeals, findMeal, findUser } from "../services/meals.service";
import * as httpStatus from "http-status";

export const getMealIngeredientsByMealId = catchAsync(async (c) => {
  const mealId = c.req.param('mealId');
  const meal = await findMeal({ id: mealId });

  if (_.isEmpty(meal)) {
    const response = await fetch(`${process.env["MEAL_DB_API"]}/lookup.php?i=${mealId}`);

    if (!response.ok) {
      throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, { message: "Failed to fetch data from MEAL_DB_API" });
    }
    const { meals }: any = await response.json();

    const mealsData = await createManyMeals({ data: _.map(meals, (item) => ({ external_id: item?.idMeal })) });

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
    const ingredientsData = await findIngredientByNames({ names: ingredientsNames });

    return c.json({ data: ingredientsData });

  }

  const resMeal = await findMeal({ id: mealId });
  const ingredients = await find({ mealId: resMeal?.id! });

  return c.json({ data: ingredients });
});

export const findMealByExternalId = catchAsync(async (c) => {
  const externalId = c.req.param('externalId');
  const meal = await findMeal({ id: externalId, external_id: externalId });


  if (_.isEmpty(meal)) {
    const response = await fetch(`${process.env["MEAL_DB_API"]}/lookup.php?i=${externalId}`);

    if (!response.ok) {
      throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, { message: "Failed to fetch data from MEAL_DB_API" });
    }
    const { meals }: any = await response.json();

    const mealsData = await createManyMeals({ data: _.map(meals, (item) => ({ external_id: item?.idMeal })) });

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
