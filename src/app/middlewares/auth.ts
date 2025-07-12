import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError";
import httpStatus from "http-status-codes";

export const checkAuth = (...authRoles: string[]) => {
  return async (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    const userInfo = (await verifyAccessToken(req, res, next)) as JwtPayload;

    if (authRoles.length && !authRoles.includes(userInfo.role)) {
      throw new AppError(
        "You are not authorized to access this resource",
        httpStatus.FORBIDDEN
      );
    }

    req.user = userInfo;
    next();
  };
};
