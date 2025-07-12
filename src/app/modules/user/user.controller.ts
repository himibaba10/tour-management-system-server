import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import userServices from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const newUser = await userServices.createUser(req.body);

  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: newUser,
  });
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { data: users, meta } = await userServices.getUsers();

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: users,
    meta,
  });
});

const updateUser = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const updatedUser = await userServices.updateUser(
      req.params.userId,
      req.body,
      req.user as JwtPayload
    );

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Users updated successfully",
      data: updatedUser,
    });
  }
);

const userControllers = {
  createUser,
  getUsers,
  updateUser,
};

export default userControllers;
