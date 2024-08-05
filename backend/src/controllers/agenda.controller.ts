import { AgendaName } from "@prisma/client";
import { createMealsAgenda, deleteMealsAgenda, getMealAgendaByUserId, updateMealsAgenda } from "../services/meals.agenda.service";
import { catchAsync } from "../utils/catchAsync";
import { CreateSchemaType, UpdateSchemaType } from "../utils/validator/agenda.validator";

export const show = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const data = await getMealAgendaByUserId({ data: { user_id: id } });
  return ctx.json({ data });
});

export const find = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const agendaName = ctx.req.query('agendaName');

  const data = await getMealAgendaByUserId({ data: { user_id: id, agenda_name: agendaName as AgendaName || "SNACK" } });
  return ctx.json({ data });
});

export const create = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const body = await ctx.req.parseBody() as unknown as CreateSchemaType;

  const data = await createMealsAgenda({ data: { ...body, user_id: id } });
  return ctx.json({ data });
});

export const update = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const agendaId = ctx.req.param('agendaId');

  const body = await ctx.req.parseBody() as unknown as UpdateSchemaType;

  const data = await updateMealsAgenda({ data: { ...body, id: agendaId, user_id: id } });
  return ctx.json({ data });
});

export const remove = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const agendaId = ctx.req.param('agendaId');

  const data = await deleteMealsAgenda({ data: { id: agendaId, user_id: id } });
  return ctx.json({ data });
});