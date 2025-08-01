import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import authServices from "./auth.service";
import setCookies from "../../utils/setCookies";
import clearCookies from "../../utils/clearCookies";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../utils/AppError";
import envVars from "../../configs/env";
import getUserTokens from "../../utils/getUserTokens";
import passport from "passport";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", (error: any, user: any, info: any) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return next(new AppError(info.message, httpStatus.NOT_FOUND));
      }

      const tokens = getUserTokens(user);

      setCookies(res, tokens);

      user.password = undefined;

      sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: {
          ...tokens,
          user,
        },
      });
    })(req, res, next);
  }
);

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

const logout = catchAsync(async (req: Request, res: Response) => {
  clearCookies(res);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User logged out successfully",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const user = req.user;

  await authServices.resetPassword(
    user as JwtPayload,
    oldPassword,
    newPassword
  );

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Password reset successful",
    data: null,
  });
});

const googleCallback = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const redirect = req.query.state;

  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const tokens = getUserTokens(user);

  setCookies(res, tokens);

  res.redirect(`${envVars.FRONTEND_URI}${redirect}`);
});

const authControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallback,
};

export default authControllers;
