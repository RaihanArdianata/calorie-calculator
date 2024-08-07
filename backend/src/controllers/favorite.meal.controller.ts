import httpStatus = require("http-status");
import { create, remove } from "../services/favorite.meals.service";
import { findMeal } from "../services/meals.service";
import ApiError from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";
import * as _ from 'lodash';


export const add = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const mealId = ctx.req.param('mealId');

  const mealData = await findMeal({ id: mealId });

  if (!mealData?.id) {
    throw new ApiError(httpStatus.NOT_FOUND, { message: "Data not found" });
  }

  const data = await create({ data: { meal_id: mealId, user_id: id, external_id: mealData?.external_id! } });
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