import bcryptjs from "bcryptjs";
import AppError from "./AppError";
import httpStatus from "http-status-codes";

const matchPassword = async (password: string, existingPasword: string) => {
  const passwordMatched = await bcryptjs.compare(password, existingPasword);

  if (!passwordMatched) {
    throw new AppError("Password did not match", httpStatus.BAD_REQUEST);
  }
};

export default matchPassword;
