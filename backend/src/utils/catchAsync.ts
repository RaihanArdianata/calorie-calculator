import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { errorConverter } from "../middleware/error.middleware";
import { StatusCode } from "hono/utils/http-status";
import ApiError from "./ApiError";

export const catchAsync = (fn: (c: Context, next: Next) => void) => async (c: Context, next: Next) => {
  try {
    return await fn(c, next);
  } catch (error: any) {
    if (error instanceof ApiError) {
      const { response, statusCode } = await errorConverter({ message: error.message, statusCode: error.statusCode });
      throw new HTTPException(statusCode, { message: response.message });
    } else {
      const { response, statusCode } = await errorConverter(error);
      throw new HTTPException(statusCode, { message: response.message });
    }
  }
};