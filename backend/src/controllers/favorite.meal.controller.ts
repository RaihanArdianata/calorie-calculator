import httpStatus = require("http-status");
import { create, find, remove } from "../services/favorite.meals.service";
import { findMeal } from "../services/meals.service";
import ApiError from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";
import * as _ from 'lodash';
import { fetchAndCreateIngredients, fetchAndCreateMeal } from "../utils/externalApi";
import { ingredientsExtractor } from "../utils/ingredientsExtractor";


export const add = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const mealId = ctx.req.param('mealId');

  let mealData = await findMeal({ id: mealId });

  // if (_.isEmpty(mealData)) {
  //   const { meals, insertedData } = await fetchAndCreateMeal(mealId);

  //   const { ingredientsNames } = ingredientsExtractor(meals[0]);
  //   const ingredientsData = await fetchAndCreateIngredients(ingredientsNames, insertedData?.[0].id);

  //   mealData = await findMeal({ id: mealId });
  // }

  if (!mealData?.id) {
    throw new ApiError(httpStatus.NOT_FOUND, { message: "Data not found" });
  }

  const favMealData = await find({ id: mealData.id, external_id: mealData.external_id, user_id: id });

  if (!_.isEmpty(favMealData)) {
    throw new ApiError(httpStatus.CONFLICT, { message: "Duplicate data" });

  }

  const data = await create({ data: { meal_id: mealData.id, user_id: id, external_id: mealData?.external_id! } });
  return ctx.json({ data });
});


export const removes = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const favoriteId = ctx.req.param('favoriteId');
  const mealId = ctx.req.param('mealId');

  const mealData = await findMeal({ id: mealId });

  if (!mealData?.id) {
    throw new ApiError(httpStatus.NOT_FOUND, { message: "Data not found" });
  }

  const data = await remove({ data: { id: favoriteId, user_id: id } });
  return ctx.json({ data });
});