import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

type CatchAsync = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next?: NextFunction
) => Promise<void> | void;

const catchAsync = (fn: CatchAsync) => {
  return async (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    try {
      await fn(req, res);
    } catch (error) {
      next(error);
    }
  };
};

export default catchAsync;
