import { Router } from "express";
import { checkAuth } from "../../middlewares/auth";
import { Role } from "../user/user.interface";
import bookingValidations from "./booking.validation";
import validateRequest from "../../utils/validateRequest";
import bookingControllers from "./booking.controller";

const bookingRoutes = Router();

bookingRoutes.get("/", checkAuth(Role.SUPER_ADMIN, Role.ADMIN));
bookingRoutes.get("/:bookingId", checkAuth());
bookingRoutes.get("/my-bookings", checkAuth());

bookingRoutes.post(
  "/",
  checkAuth(),
  validateRequest(bookingValidations.createBookingZodSchema),
  bookingControllers.createBooking
);

bookingRoutes.patch(
  "/:id",
  checkAuth(),
  validateRequest(bookingValidations.updateBookingZodSchema)
);

export default bookingRoutes;
