import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import authServices from "./auth.service";
import setCookies from "../../utils/setCookies";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await authServices.credentialsLogin(req.body);

  setCookies(res, loginInfo);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: loginInfo,
  });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  const newAccessToken = await authServices.getNewAccessToken(refreshToken);

  setCookies(res, newAccessToken);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "New access token generated successfully",
    data: newAccessToken,
  });
});

const authControllers = {
  credentialsLogin,
  getNewAccessToken,
};

export default authControllers;
