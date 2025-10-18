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
    message: "Users updated successfully",
    data: stats,
  });
});

const statsControllers = {
  getUserStats,
};

export default statsControllers;
