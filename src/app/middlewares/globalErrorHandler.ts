import { NextFunction, Request, Response } from "express";
import envVars from "../configs/env";
import AppError from "../utils/AppError";
import {
  handleAppError,
  handleCastError,
  handleDuplicateError,
  handleError,
  handleZodError,
} from "../utils/handleError";
import { IErrorSources } from "../interfaces/error";
import deleteImageFromCloudinary from "../utils/deleteImageFromCloudinary";

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let message = "Something went wrong";
  let statusCode = err.statusCode || 500;
  let errorSources: any[] = [];
  const stack = err?.stack || "";

  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    (req.files as Express.Multer.File[]).map(
      async (file) => await deleteImageFromCloudinary(file.path)
    );
  }

  // handle duplicate error
  if (err.code === 11000) {
    message = handleDuplicateError(err).message;
    statusCode = handleDuplicateError(err).statusCode;
  }
  // handle cast error
  else if (err.name === "CastError") {
    message = handleCastError(err).message;
  }
  // handle zod error
  else if (err.name === "ZodError") {
    message = handleZodError(err).message;
    errorSources = handleZodError(err).errorSources as IErrorSources[];
  } else if (err instanceof AppError) {
    message = handleAppError(err).message;
  } else if (err instanceof Error) {
    message = handleError(err).message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV === "development" ? stack : null,
  });
};

export default globalErrorHandler;
