import { JwtPayload, SignOptions } from "jsonwebtoken";
import { generateToken } from "./jwt";

const getUserTokens = (user: JwtPayload, options?: SignOptions) => {
  const jwtPayload: JwtPayload = {
    _id: user._id,
    role: user.role,
    email: user.email,
  };

  const tokens = generateToken(jwtPayload, options);

  return tokens;
};

export default getUserTokens;
