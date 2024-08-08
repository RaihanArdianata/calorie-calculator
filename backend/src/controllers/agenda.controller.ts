import { AgendaName } from "@prisma/client";
import { createMealsAgenda, deleteMealsAgenda, findMealAgendaByUserId, getMealAgendaByUserId, updateMealsAgenda } from "../services/meals.agenda.service";
import { catchAsync } from "../utils/catchAsync";
import { CreateSchemaType, UpdateSchemaType } from "../utils/validator/agenda.validator";
import * as _ from 'lodash';
import { findMeal } from "../services/meals.service";
import { fetchAndCreateIngredients, fetchAndCreateMeal } from "../utils/externalApi";
import { ingredientsExtractor } from "../utils/ingredientsExtractor";
import ApiError from "../utils/ApiError";
import httpStatus = require("http-status");
import { totalCalorie } from "../utils/formula";

export const show = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const data = await getMealAgendaByUserId({ data: { user_id: id } });
  return ctx.json({ data });
});

export const find = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  console.log(ctx.req.query('agendaName'));

  const agendaName = ctx.req.query('agendaName');
  const startDate = ctx.req.query('startDate');
  const endDate = ctx.req.query('endDate');

  const data = await findMealAgendaByUserId({ data: { user_id: id, agenda_name: agendaName as AgendaName }, startOfDay: startDate, endOfDay: endDate });

  const result = data.map((data) => {
    const { meal: { tr_ingredients } } = data;

    let resultTotalCalorie = 0;

    if (_.isArray(tr_ingredients)) {
      resultTotalCalorie = totalCalorie({ data: tr_ingredients });
    }

    return { ...data, total_calorie: resultTotalCalorie };

  });
  return ctx.json({ data: result });
});

export const create = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const body = await ctx.req.parseBody() as unknown as CreateSchemaType;

  let mealData = await findMeal({ id: body.meal_id });

  // if (_.isEmpty(mealData)) {
  //   const { meals, insertedData } = await fetchAndCreateMeal(body.meal_id);

  //   const { ingredientsNames } = ingredientsExtractor(meals[0]);
  //   const ingredientsData = await fetchAndCreateIngredients(ingredientsNames, insertedData?.[0].id);

  //   mealData = await findMeal({ id: body.meal_id });
  // }

  if (!mealData?.id) {
    throw new ApiError(httpStatus.NOT_FOUND, { message: "Data not found" });
  }

  const data = await createMealsAgenda({ data: { ...body, meal_id: mealData.id, user_id: id, target_calorie: Number(body.target_calorie) } });
  return ctx.json({ data });
});

export const update = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const agendaId = ctx.req.param('agendaId');

  const body = await ctx.req.parseBody() as unknown as UpdateSchemaType;

  const data = await updateMealsAgenda({ data: { ...body, id: agendaId, user_id: id, target_calorie: Number(body.target_calorie) } });
  return ctx.json({ data });
});

export const remove = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const agendaId = ctx.req.param('agendaId');

  const data = await deleteMealsAgenda({ data: { id: agendaId, user_id: id } });
  return ctx.json({ data });
});