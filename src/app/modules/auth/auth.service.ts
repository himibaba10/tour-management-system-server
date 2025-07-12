import AppError from "../../utils/AppError";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";

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

  return {
    email: existingUser.email,
  };
};

const authServices = {
  credentialsLogin,
};

export default authServices;
