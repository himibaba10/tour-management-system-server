import httpStatus from "http-status-codes";
import { getRedisClient } from "../../configs/redis";
import { OTP_EXPIRY_TIME } from "../../constants";
import AppError from "../../utils/AppError";
import generateOtp from "../../utils/generateOtp";
import sendEmail from "../../utils/sendEmail";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";

const sendOtp = async ({ email, name }: Pick<IUser, "email" | "name">) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  if (existingUser.isVerified) {
    throw new AppError("User is already verified", httpStatus.BAD_REQUEST);
  }

  const otp = generateOtp();

  const redisKey = `otp:${email}`;

  await getRedisClient().set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRY_TIME,
    },
  });

  await sendEmail({
    to: email,
    subject: "OTP Verification - Tour Management",
    templateName: "otp",
    templateData: {
      name,
      otp,
    },
  });
};

const verifyOtp = async ({ email, otp }: { email: string; otp: string }) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  if (existingUser.isVerified) {
    throw new AppError("User is already verified", httpStatus.BAD_REQUEST);
  }

  const redisKey = `otp:${email}`;
  const storedOtp = await getRedisClient().get(redisKey);

  if (!storedOtp || storedOtp !== otp) {
    throw new AppError("Invalid or expired OTP", httpStatus.BAD_REQUEST);
  }

  Promise.all([
    await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { runValidators: true }
    ),
    await getRedisClient().del([redisKey]),
  ]);
};

const otpServices = {
  sendOtp,
  verifyOtp,
};

export default otpServices;
