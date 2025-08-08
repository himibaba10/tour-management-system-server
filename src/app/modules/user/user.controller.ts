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

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await userServices.getSingleUser(id);
  sendResponse(res, {
    success: true,
    status: httpStatus.CREATED,
    message: "User Retrieved Successfully",
    data: result.data,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as JwtPayload)._id;
  const result = await userServices.getMe(userId);
  sendResponse(res, {
    success: true,
    status: httpStatus.CREATED,
    message: "User Profile retrieved Successfully",
    data: result.data,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
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
});

const userControllers = {
  createUser,
  getUsers,
  getSingleUser,
  getMe,
  updateUser,
};

export default userControllers;
