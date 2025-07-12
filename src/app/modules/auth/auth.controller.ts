import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import authServices from "./auth.service";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await authServices.credentialsLogin(req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: loginInfo,
  });
});

const authControllers = {
  credentialsLogin,
};

export default authControllers;
