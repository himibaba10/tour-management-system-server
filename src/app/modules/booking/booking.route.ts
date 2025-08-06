import { Router } from "express";
import { checkAuth } from "../../middlewares/auth";
import { Role } from "../user/user.interface";
import bookingValidations from "./booking.validation";
import validateRequest from "../../utils/validateRequest";
import bookingControllers from "./booking.controller";

const bookingRoutes = Router();

bookingRoutes.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  bookingControllers.getAllBookings
);
bookingRoutes.get(
  "/:bookingId",
  checkAuth(),
  bookingControllers.getSingleBooking
);
bookingRoutes.get(
  "/my-bookings",
  checkAuth(),
  bookingControllers.getUserBookings
);

bookingRoutes.post(
  "/",
  checkAuth(),
  validateRequest(bookingValidations.createBookingZodSchema),
  bookingControllers.createBooking
);

bookingRoutes.patch(
  "/:bookingId",
  checkAuth(),
  validateRequest(bookingValidations.updateBookingZodSchema),
  bookingControllers.updateBookingStatus
);

export default bookingRoutes;
