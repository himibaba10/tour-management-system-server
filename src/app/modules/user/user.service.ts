import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { AuthProvider, IAuthProvider, IUser, Role } from "./user.interface";
import User from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import hashPassword from "../../utils/hashPassword";

const createUser = async (payload: Partial<IUser>) => {
  const { password } = payload;

  const hashedPassword = await hashPassword(password as string);

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
  const users = await User.find().select("-password");
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

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  userInfo: JwtPayload
) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) throw new AppError("User not found", httpStatus.NOT_FOUND);

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
  }).select("-password");

  return updatedUser;
};

const userServices = {
  createUser,
  getUsers,
  getSingleUser,
  getMe,
  updateUser,
};

export default userServices;
