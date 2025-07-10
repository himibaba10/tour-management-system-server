import { NextFunction, Request, Response } from "express";
import envVars from "../configs/env";
import { AppError } from "../utils/AppError";

const globalErrorHandler = (
  err: { message: string; stack: string },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let message = "Something went wrong";
  let statusCode = 500;
  let stack = "";
  if (err instanceof AppError) {
    message = err.message;
    statusCode = err.statusCode;
    stack = err.stack;
  } else if (err instanceof Error) {
    message = err.message;
    statusCode = 500; // Default to internal server error
    stack = err.stack || "";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: envVars.NODE_ENV === "development" ? stack : null,
  });
};

export default globalErrorHandler;
