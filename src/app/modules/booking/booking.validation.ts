import z from "zod";
import { BOOKING_STATUS } from "./booking.interface";

const createBookingZodSchema = z.object({
  guestCount: z
    .number({
      required_error: "Guest count is required",
      invalid_type_error: "Guest count must be a number",
    })
    .int()
    .positive({ message: "Guest count must be a positive number" })
    .min(1, "Guest count must be at least 1"),
  tour: z.string({ required_error: "Tour is required" }),
});

const updateBookingZodSchema = z.object({
  bookingStatus: z.enum(Object.values(BOOKING_STATUS) as [string]),
});

const bookingValidations = {
  createBookingZodSchema,
  updateBookingZodSchema,
};

export default bookingValidations;
