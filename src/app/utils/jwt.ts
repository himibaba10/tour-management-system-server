import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import envVars from "../configs/env";
import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";
import httpStatus from "http-status-codes";

export const generateAccessToken = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, envVars.JWT_SECRET, {
    expiresIn: envVars.JWT_EXPIRATION,
  } as SignOptions);

  return accessToken;
};

export const verifyAccessToken = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError("Access token is missing", httpStatus.UNAUTHORIZED);
      }

      const decoded = await jwt.verify(token, envVars.JWT_SECRET);

      return decoded;
    } catch (error) {
      next(error);
    }
  };
};
