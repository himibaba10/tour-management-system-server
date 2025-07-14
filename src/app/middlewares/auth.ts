import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError";
import httpStatus from "http-status-codes";

export const checkAuth = (...authRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError("Access token is missing", httpStatus.UNAUTHORIZED);
    }

    const userInfo = (await verifyToken(token)) as JwtPayload;

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
