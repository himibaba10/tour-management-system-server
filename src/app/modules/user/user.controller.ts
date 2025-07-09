/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import userServices from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await userServices.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error: any) {
    next(error);
  }
};

const userControllers = {
  createUser,
};

export default userControllers;
