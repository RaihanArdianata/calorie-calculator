import { catchAsync } from "../utils/catchAsync";
import { CreateSchemaType, DeleteSchemaType, FetchAllSchemaType } from "../utils/validator/users.validator";
import * as service from "../services/users.service";

export const fetchAll = catchAsync(async ctx => {
  const query = ctx.req.query() as unknown as FetchAllSchemaType;
  const datasSize = await service.fetchDatabaseSize();
  const totalPages = Math.ceil(datasSize/(query.limit ?? 10));
  const datas = await service.fetchAll(query, totalPages);
  if (query.page > totalPages) query.page = totalPages;

  return ctx.json({
    datas,
    ...query,
    totalPages,
    datasSize,
  });
});

export const create = catchAsync(async ctx => {
  const body = await ctx.req.parseBody() as unknown as CreateSchemaType;
  const data = await service.create(body);

  return ctx.json({ data });
});

export const removes = catchAsync(async ctx => {
  const body = await ctx.req.parseBody() as unknown as DeleteSchemaType;
  console.log(body);
  await service.removes(body);

  return ctx.json({});
});

export const favMeals = catchAsync(async ctx => {
  const userId = ctx.req.param("userId");
  const data = await service.favMeals(userId);
  return ctx.json({ data });
});
