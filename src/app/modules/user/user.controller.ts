import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import userServices from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

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

const userControllers = {
  createUser,
  getUsers,
};

export default userControllers;
