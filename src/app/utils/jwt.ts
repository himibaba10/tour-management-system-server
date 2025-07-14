import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import envVars from "../configs/env";
import { TokenType } from "../interfaces/enum";
import AppError from "./AppError";

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

export const verifyToken = async (
  token: string,
  tokenType: TokenType = TokenType.ACCESS
) => {
  if (!token) {
    throw new AppError("Token not found", 404);
  }

  const secret =
    tokenType === TokenType.ACCESS
      ? envVars.JWT_ACCESS_SECRET
      : envVars.JWT_REFRESH_SECRET;

  const decoded = await jwt.verify(token, secret);

  return decoded;
};
