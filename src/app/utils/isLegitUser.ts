import httpStatus from "http-status-codes";
import AppError from "./AppError";
import { IsActive, IUser } from "../modules/user/user.interface";

const isLegitUser = (user: IUser | null) => {
  if (!user) {
    throw new AppError("User not found", httpStatus.UNAUTHORIZED);
  }

  if (user.isActive !== IsActive.ACTIVE) {
    throw new AppError(
      "Your account is not active. Please contact support.",
      httpStatus.FORBIDDEN
    );
  }

  if (user.isDeleted) {
    throw new AppError(
      "Your account has been deleted. Please contact support.",
      httpStatus.FORBIDDEN
    );
  }
};

export default isLegitUser;
