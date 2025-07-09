/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import userServices from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await userServices.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: `Could not create user - ${error.message}`,
      error,
    });
  }
};

const userControllers = {
  createUser,
};

export default userControllers;
