import AppError from "../../utils/AppError";
import { IsActive, IUser } from "../user/user.interface";
import User from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import getUserTokens from "../../utils/getUserTokens";
import { verifyToken } from "../../utils/jwt";
import { TokenType } from "../../interfaces/enum";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new AppError("Invalid credentials", httpStatus.BAD_REQUEST);
  }

  const passwordMatched = await bcryptjs.compare(
    password as string,
    existingUser.password as string
  );

  if (!passwordMatched) {
    throw new AppError("Invalid credentials", httpStatus.BAD_REQUEST);
  }

  const { accessToken, refreshToken } = getUserTokens(existingUser);

  existingUser.password = undefined; // Remove password from the user object

  return {
    accessToken,
    refreshToken,
    user: existingUser,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const userInfo = (await verifyToken(
    refreshToken,
    TokenType.REFRESH
  )) as JwtPayload;

  const existingUser = await User.findById(userInfo._id);

  if (!existingUser) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  if (
    existingUser.isActive === IsActive.INACTIVE ||
    existingUser.isActive === IsActive.BLOCKED
  ) {
    throw new AppError(
      `User is ${existingUser.isActive}`,
      httpStatus.FORBIDDEN
    );
  }

  if (existingUser.isDeleted) {
    throw new AppError("User is deleted", httpStatus.NOT_FOUND);
  }

  const { accessToken } = getUserTokens(existingUser);

  return { accessToken };
};

const authServices = {
  credentialsLogin,
  getNewAccessToken,
};

export default authServices;
