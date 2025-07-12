import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { AuthProvider, IAuthProvider, IUser } from "./user.interface";
import User from "./user.model";
import bcryptjs from "bcryptjs";
import envVars from "../../configs/env";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(
      "User with this email already exists",
      httpStatus.CONFLICT
    );
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    parseInt(envVars.SALT as string)
  );

  const authProvider: IAuthProvider = {
    provider: AuthProvider.CREDENTIAL,
    providerId: payload.email as string,
  };

  const newUser = await User.create({
    ...payload,
    password: hashedPassword,
    auths: [authProvider],
  });

  return newUser;
};

const getUsers = async () => {
  const users = await User.find();
  const totalUsers = await User.countDocuments();

  if (!totalUsers) {
    throw new AppError("No users found", httpStatus.NOT_FOUND);
  }

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

const userServices = {
  createUser,
  getUsers,
};

export default userServices;
