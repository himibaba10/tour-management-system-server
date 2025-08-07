import httpStatus from "http-status-codes";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import envVars from "../configs/env";
import { TokenType } from "../interfaces/enum";
import AppError from "./AppError";

export const generateToken = (payload: JwtPayload) => {
  const accessSecret = envVars.JWT_ACCESS_SECRET;
  const refreshSecret = envVars.JWT_REFRESH_SECRET;

  const accessExpirationDay = envVars.JWT_ACCESS_EXPIRATION;
  const refreshExpirationDay = envVars.JWT_REFRESH_EXPIRATION;

  const accessToken = jwt.sign(payload, accessSecret, {
    expiresIn: accessExpirationDay,
  } as SignOptions);

  const refreshToken = jwt.sign(payload, refreshSecret, {
    expiresIn: refreshExpirationDay,
  } as SignOptions);

  return { accessToken, refreshToken };
};

export const verifyToken = async (
  token: string,
  tokenType: TokenType = TokenType.ACCESS
) => {
  if (!token) throw new AppError("Token not found", httpStatus.UNAUTHORIZED);

  const secret =
    tokenType === TokenType.ACCESS
      ? envVars.JWT_ACCESS_SECRET
      : envVars.JWT_REFRESH_SECRET;

  const decoded = await jwt.verify(token, secret);

  return decoded;
};
