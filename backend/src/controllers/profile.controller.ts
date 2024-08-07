import { getUserById } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { create, removes, fetchProfileWithFavMeals, isAdmin } from "../services/users.service";
import { UpdateSchemaType } from "../utils/validator/users.validator";
import { isNull } from "lodash";

export const show = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const data = await (ctx.req.query("fetchMeals") === "true" ? fetchProfileWithFavMeals(id) : getUserById(id)); 
  return ctx.json({ data });
});

export const update = catchAsync(async ctx => {
  const body = await ctx.req.parseBody() as UpdateSchemaType;
  const { id } = ctx.get("jwtPayload");
  const admin = await isAdmin(id)
  console.log(admin);
  const data = await create({...body, id, admin: isNull(admin) ? "" : "true" });
  return ctx.json({ data });
});

export const remove = catchAsync(async ctx => {
  const { id } = ctx.get("jwtPayload");
  const data = await removes({ id });
  return ctx.json({ data });
});
