import { NextFunction, Request, Response } from "express";
import envVars from "../configs/env";

const globalErrorHandler = (
  err: { message: string; stack: string },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(500).json({
    success: false,
    message: err?.message || "Internal Server Error",
    error: err.message || "An unexpected error occurred",
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};

export default globalErrorHandler;
