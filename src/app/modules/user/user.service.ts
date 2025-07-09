import { IUser } from "./user.interface";
import User from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const newUser = await User.create(payload);

  return newUser;
};

const userServices = {
  createUser,
};

export default userServices;
