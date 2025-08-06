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

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await bookingServices.getAllBookings();
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: bookings,
  });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingServices.getBookingById(req.params.bookingId);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Booking retrieved successfully",
    data: booking,
  });
});

const getUserBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await bookingServices.getUserBookings(
    (req.user as JwtPayload)._id
  );

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: bookings,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const updated = await bookingServices.updateBookingStatus(
    req.body,
    req.params.bookingId
  );
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Booking Status Updated Successfully",
    data: updated,
  });
});

const bookingControllers = {
  createBooking,
  getUserBookings,
  getSingleBooking,
  getAllBookings,
  updateBookingStatus,
};

export default bookingControllers;
