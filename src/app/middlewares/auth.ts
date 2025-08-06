import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError";
import httpStatus from "http-status-codes";
import User from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new AppError("Access token is missing", httpStatus.UNAUTHORIZED);
    }

    const userInfo = (await verifyToken(token)) as JwtPayload;

    const existingUser = await User.findById(userInfo._id);

    if (!existingUser) {
      throw new AppError("User not found", httpStatus.UNAUTHORIZED);
    }

    if (existingUser.isActive !== IsActive.ACTIVE) {
      throw new AppError(
        "Your account is not active. Please contact support.",
        httpStatus.FORBIDDEN
      );
    }

    if (existingUser.isDeleted) {
      throw new AppError(
        "Your account has been deleted. Please contact support.",
        httpStatus.FORBIDDEN
      );
    }

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
