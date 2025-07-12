import AppError from "../../utils/AppError";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { generateAccessToken } from "../../utils/jwt";

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

  const accessToken = generateAccessToken({
    _id: existingUser._id,
    role: existingUser.role,
    email: existingUser.email,
  });

  return {
    accessToken,
  };
};

const authServices = {
  credentialsLogin,
};

export default authServices;
