import { Prisma } from "@prisma/client";
import { Context, ErrorHandler } from "hono";
import { HTTPResponseError } from "hono/types";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";
import ApiError from "../utils/ApiError";

const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError) => {

  switch (error.stack) {
    case 'P2002':
      return new ApiError(400, {
        message: `Duplicate field value: ${error?.meta?.target}`
      });
    case 'P2014':
      return new ApiError(400, {
        message: `Invalid ID: ${error?.meta?.target}`,
      });
    case 'P2003':
      return new ApiError(400, {
        message: `Invalid input data: ${error?.meta?.target}`
      });
    default:
      return new ApiError(400, {
        message: `Something went wrong: ${error.message}`
      });
  }
};

export const errorConverter = async (error: { statusCode: StatusCode; message: string; }) => {
  let response: ApiError;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    response = handlePrismaError(error);
  } else {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    response = new ApiError(statusCode, {
      message: message,
    });
  }

  return {
    statusCode: error.statusCode,
    response: response,
  };
};

export const errorHandler: ErrorHandler = (error: Error | HTTPResponseError, c: Context) => {
  console.log(error.message, error.name, error);

  if (error instanceof HTTPException) {
    return c.json({ error: 'Request Error', details: [{ message: error.message }] }, error.status);
  }
  return c.json({ error: "Server Error", details: error.message }, 500);
};