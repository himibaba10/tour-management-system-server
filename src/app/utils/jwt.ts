import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import envVars from "../configs/env";
import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";
import httpStatus from "http-status-codes";
import { TokenType } from "../interfaces/tokenType";

export const generateToken = (type: TokenType, payload: JwtPayload) => {
  const secret =
    type === TokenType.ACCESS
      ? envVars.JWT_ACCESS_SECRET
      : envVars.JWT_REFRESH_SECRET;
  const expirationDay =
    type === TokenType.ACCESS
      ? envVars.JWT_ACCESS_EXPIRATION
      : envVars.JWT_REFRESH_EXPIRATION;

  const token = jwt.sign(payload, secret, {
    expiresIn: expirationDay,
  } as SignOptions);

  return token;
};

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError("Access token is missing", httpStatus.UNAUTHORIZED);
    }

    const decoded = await jwt.verify(token, envVars.JWT_ACCESS_SECRET);

    return decoded;
  } catch (error) {
    next(error);
  }
};
