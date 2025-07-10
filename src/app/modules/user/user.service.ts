import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { IUser } from "./user.interface";
import User from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const newUser = await User.create(payload);

  return newUser;
};

const getUsers = async () => {
  const users = await User.find();

  if (users.length === 0) {
    throw new AppError("No users found", httpStatus.NOT_FOUND);
  }

  return users;
};

const userServices = {
  createUser,
  getUsers,
};

export default userServices;
