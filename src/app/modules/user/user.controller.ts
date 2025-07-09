/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import User from "./user.model";
import httpStatus from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const newUser = await User.create({ name, email });

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

const userCtrollers = {
  createUser,
};

export default userCtrollers;
