import { JwtPayload } from "jsonwebtoken";
import { generateToken } from "./jwt";
import { TokenType } from "../interfaces/enum";

const getUserTokens = (user: JwtPayload) => {
  const jwtPayload: JwtPayload = {
    _id: user._id,
    role: user.role,
    email: user.email,
  };

  const accessToken = generateToken(TokenType.ACCESS, jwtPayload);
  const refreshToken = generateToken(TokenType.REFRESH, jwtPayload);

  return {
    accessToken,
    refreshToken,
  };
};

export default getUserTokens;
