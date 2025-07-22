import AppError from "../../utils/AppError";
import { IsActive, IUser } from "../user/user.interface";
import User from "../user/user.model";
import httpStatus from "http-status-codes";
import getUserTokens from "../../utils/getUserTokens";
import { verifyToken } from "../../utils/jwt";
import { TokenType } from "../../interfaces/enum";
import { JwtPayload } from "jsonwebtoken";
import hashPassword from "../../utils/hashPassword";
import matchPassword from "../../utils/matchPassword";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const existingUser = await User.findOne({ email });
  if (!existingUser || existingUser.isDeleted) {
    throw new AppError("Invalid credentials", httpStatus.BAD_REQUEST);
  }

  if (existingUser.isActive === IsActive.BLOCKED) {
    throw new AppError(
      `${existingUser.isActive} user can't login`,
      httpStatus.BAD_REQUEST
    );
  }

  await matchPassword(password as string, existingUser.password as string);

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

const resetPassword = async (
  user: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  const existingUser = await User.findById(user._id);

  if (!existingUser) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  await matchPassword(oldPassword, existingUser.password as string);

  const hashedPassword = await hashPassword(newPassword);

  existingUser.password = hashedPassword;
  await existingUser.save();
};

const authServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};

export default authServices;
