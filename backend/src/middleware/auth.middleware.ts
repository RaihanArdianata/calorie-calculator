import { jwt } from "hono/jwt";
import { catchAsync } from "../utils/catchAsync";
import { getUserById } from "../services/auth.service";
import { isEmpty } from "lodash";
import ApiError from "../utils/ApiError";
import * as HttpStatus from "http-status";
import { isAdmin } from "../services/users.service";

export const authentication = jwt({ secret: process.env.JWT_SECRET || 'default', });

export const authenticationAdmin = catchAsync(async (c, next) => {
  const { id } = c.get("jwtPayload");
  const findUser = await getUserById({ id });

  if (isEmpty(findUser)) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, { message: "unauthorize" });
  } else {
    if (isEmpty(await isAdmin(id))) throw new ApiError(HttpStatus.UNAUTHORIZED, { message: "unauthorize" });
    return await next();
  }
});

export const authenticationUser = catchAsync(async (c, next) => {
  const { id } = c.get("jwtPayload");
  const findUser = await getUserById({ id });

  if (isEmpty(findUser)) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, { message: "unauthorize" });
  } else {
    return await next();
  }
});
