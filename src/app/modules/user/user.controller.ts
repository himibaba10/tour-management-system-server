import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import userServices from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const newUser = await userServices.createUser(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userServices.getUsers();

  res.status(httpStatus.OK).json({
    success: true,
    message: "Users fetched successfully",
    data: users,
  });

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});

const userControllers = {
  createUser,
  getUsers,
};

export default userControllers;
