import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import userServices from "./user.service";
import catchAsync from "../../utils/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const newUser = await userServices.createUser(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
});

const userControllers = {
  createUser,
};

export default userControllers;
