import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError";
import httpStatus from "http-status-codes";
import User from "../modules/user/user.model";
import isLegitUser from "../utils/isLegitUser";

export const checkAuth = (...authRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new AppError("Access token is missing", httpStatus.UNAUTHORIZED);
    }

    const userInfo = (await verifyToken(token)) as JwtPayload;

    const existingUser = await User.findById(userInfo._id);

    isLegitUser(existingUser);

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
