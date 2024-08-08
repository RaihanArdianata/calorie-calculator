import { catchAsync } from "../utils/catchAsync";
import * as _ from "lodash";
import { ingredientsExtractor } from "../utils/ingredientsExtractor";
import { find } from "../services/trIngredients.service";
import { findMeal, findUser } from "../services/meals.service";
import { fetchAndCreateIngredients, fetchAndCreateMeal } from "../utils/externalApi";

export const getMealIngredientsByMealId = catchAsync(async (c) => {
  const mealId = c.req.param('mealId');
  let meal = await findMeal({ id: mealId });

  if (_.isEmpty(meal)) {
    const { meals, insertedData } = await fetchAndCreateMeal(mealId);

    const { ingredientsNames } = ingredientsExtractor(meals[0]);
    const ingredientsData = await fetchAndCreateIngredients(ingredientsNames, insertedData?.[0].id);

    return c.json({ data: ingredientsData });
  }

  const ingredients = await find({ mealId: meal?.id });
  return c.json({ data: ingredients });

});


export const findMealByExternalId = catchAsync(async (c) => {
  const externalId = c.req.param('externalId');
  let meal = await findMeal({ id: externalId, external_id: externalId });

  if (_.isEmpty(meal)) {
    const { meals, insertedData } = await fetchAndCreateMeal(externalId);

    const { ingredientsNames } = ingredientsExtractor(meals[0]);
    await fetchAndCreateIngredients(ingredientsNames, insertedData?.[0].id);

    meal = await findMeal({ id: externalId, external_id: externalId });

    return c.json({ data: meal });
  }

  return c.json({ data: meal });
});

export const findMealBookmark = catchAsync(async ctx => {
  const externalId = ctx.req.param("externalId");
  const data = await findUser(externalId);
  return ctx.json({ data });
});
