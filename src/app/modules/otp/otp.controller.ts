import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";
import otpServices from "./otp.service";

const sendOtp = catchAsync(async (req: Request, res: Response) => {
  await otpServices.sendOtp(req.body);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "OTP Sent Successfully",
    data: null,
  });
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  await otpServices.verifyOtp(req.body);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "OTP Verified Successfully",
    data: null,
  });
});

const otpControllers = {
  sendOtp,
  verifyOtp,
};

export default otpControllers;
