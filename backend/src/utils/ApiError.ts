import { StatusCode } from "hono/utils/http-status";

interface errorOptions {
  message: string,
  isOperational?: boolean,
  stack?: string;
}

class ApiError extends Error {
  statusCode: StatusCode;
  isOperational: boolean;

  constructor(
    statusCode: StatusCode,
    options: errorOptions
  ) {
    super(options.message);

    this.statusCode = statusCode;
    this.isOperational = options.isOperational || false;
    if (options.stack) {
      this.stack = options.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
