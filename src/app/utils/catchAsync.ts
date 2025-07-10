import { NextFunction, Request, Response } from "express";

type CatchAsync = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<void> | void;

const catchAsync = (fn: CatchAsync) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res);
    } catch (error) {
      next(error);
    }
  };
};

export default catchAsync;
