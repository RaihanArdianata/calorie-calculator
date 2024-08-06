import { AgendaName } from "@prisma/client";
import { createMealsAgenda, deleteMealsAgenda, findMealAgendaByUserId, getMealAgendaByUserId, updateMealsAgenda } from "../services/meals.agenda.service";
import { catchAsync } from "../utils/catchAsync";
import { CreateSchemaType, UpdateSchemaType } from "../utils/validator/agenda.validator";
import * as _ from 'lodash';

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

    let calorieTotal = 0;

    if (_.isArray(tr_ingredients)) {
      _.forEach(tr_ingredients, ({ ingredient }) => {

        if (!_.isEmpty(ingredient)) {
          calorieTotal += ingredient.calories;
        }
      });
    }

    return { ...data, total_calorie: calorieTotal };

  });
  return ctx.json({ data: result });
});

export const create = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const body = await ctx.req.parseBody() as unknown as CreateSchemaType;

  const data = await createMealsAgenda({ data: { ...body, user_id: id, target_calorie: Number(body.target_calorie) } });
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