import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import statsServices from "./stats.service";
import { Request, Response } from "express";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await statsServices.getUserStats();

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "user stat fetched successfully",
    data: stats,
  });
});

const getTourStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await statsServices.getTourStats();

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Tour stat fetched successfully",
    data: stats,
  });
});

const statsControllers = {
  getUserStats,
  getTourStats,
};

export default statsControllers;
