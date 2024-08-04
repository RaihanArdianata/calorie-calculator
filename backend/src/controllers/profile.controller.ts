import { getUserById } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { create, removes } from "../services/users.service";
import { UpdateSchemaType } from "../utils/validator/users.validator";

export const show = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const data = await getUserById(id);
  return ctx.json({ data });
});

export const update = catchAsync(async ctx => {
  const body = await ctx.req.parseBody() as UpdateSchemaType;
  const { id } = ctx.get("jwtPayload");
  const data = await create({...body, id });
  return ctx.json({ data });
});

export const remove = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const data = await removes({ id });
  return ctx.json({ data });
});
