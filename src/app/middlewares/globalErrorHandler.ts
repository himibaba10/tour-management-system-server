/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import envVars from "../configs/env";
import AppError from "../utils/AppError";

const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log({ err });
  let message = "Something went wrong";
  let statusCode = 500;
  const stack = err?.stack || "";

  // handle duplicate error
  if (err.code === 11000) {
    message = `${err.keyValue.email} already exists!`;
  }
  // handle cast error
  else if (err.name === "CastError") {
    message = `${err.path} is not valid`;
  } else if (err instanceof AppError) {
    message = err.message;
    statusCode = err.statusCode;
  } else if (err instanceof Error) {
    message = err.message;
    statusCode = 500; // Default to internal server error
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: envVars.NODE_ENV === "development" ? stack : null,
  });
};

export default globalErrorHandler;
