import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { AuthProvider, IAuthProvider, IUser, Role } from "./user.interface";
import User from "./user.model";
import bcryptjs from "bcryptjs";
import envVars from "../../configs/env";
import { JwtPayload } from "jsonwebtoken";

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

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  userInfo: JwtPayload
) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  if (payload.role) {
    if (userInfo.role !== Role.ADMIN && userInfo.role !== Role.SUPER_ADMIN) {
      throw new AppError(
        "You are not allowed to change the role",
        httpStatus.FORBIDDEN
      );
    }

    if (userInfo.role === Role.ADMIN && payload.role === Role.SUPER_ADMIN) {
      throw new AppError(
        "You are not allowed to change the role to SUPER_ADMIN",
        httpStatus.FORBIDDEN
      );
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      parseInt(envVars.SALT as string)
    );
  }

  if (payload.isDeleted || payload.isVerified) {
    if (userInfo.role !== Role.ADMIN && userInfo.role !== Role.SUPER_ADMIN) {
      throw new AppError(
        "You are not allowed to change isDeleted or isVerified",
        httpStatus.FORBIDDEN
      );
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const userServices = {
  createUser,
  getUsers,
  updateUser,
};

export default userServices;
