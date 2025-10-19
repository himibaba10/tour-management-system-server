import mongoose from "mongoose";
import { IErrorResponse } from "../interfaces/error";
import { ZodError } from "zod";

export const handleDuplicateError = (err: any): IErrorResponse => {
  return {
    message: `${err.keyValue.email} already exists!`,
    statusCode: 403,
  };
};

export const handleCastError = (
  err: mongoose.Error.CastError
): IErrorResponse => {
  return {
    message: `${err.path} is not valid`,
  };
};

export const handleZodError = (err: ZodError): IErrorResponse => {
  return {
    message: `Validation error`,
    errorSources: err.issues.map((issue: any) => ({
      field: issue.path[issue.path.length - 1],
      message: issue.message,
    })),
  };
};

export const handleAppError = (err: any): IErrorResponse => {
  return {
    message: err.message,
  };
};

export const handleError = (err: any): IErrorResponse => {
  return {
    message: err.message,
  };
};
