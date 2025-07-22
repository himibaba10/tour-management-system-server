import { JwtPayload } from "jsonwebtoken";
import { generateToken } from "./jwt";

const getUserTokens = (user: JwtPayload) => {
  const jwtPayload: JwtPayload = {
    _id: user._id,
    role: user.role,
    email: user.email,
  };

  const tokens = generateToken(jwtPayload);

  return tokens;
};

export default getUserTokens;
