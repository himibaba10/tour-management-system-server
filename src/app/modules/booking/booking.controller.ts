import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import bookingServices from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServices.createBooking(
    req.body,
    (req.user as JwtPayload)._id
  );

  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "Booking created",
    data: result,
  });
});

const bookingControllers = {
  createBooking,
};

export default bookingControllers;
