import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import User from "../user/user.model";
import { IBooking } from "./booking.interface";
import Booking from "./booking.model";
import Payment from "../payment/payment.model";
import Tour from "../tour/tour.model";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createBooking = async (payload: IBooking, userId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId)
      .select("phone address")
      .session(session);
    if (!user?.phone || !user?.address) {
      throw new AppError(
        "User must have a phone or address to create a booking.",
        httpStatus.BAD_REQUEST
      );
    }

    const booking = await Booking.create([{ ...payload, user: userId }], {
      session,
    });

    const tour = await Tour.findById(payload.tour)
      .session(session)
      .select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(
        "Tour cost is not defined. Cannot create booking.",
        httpStatus.BAD_REQUEST
      );
    }

    const amount = tour.costFrom * payload.guestCount;

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          transactionId: getTransactionId(),
          amount,
        },
      ],
      { session }
    );

    booking[0].payment = payment[0]._id;
    await booking[0].save();

    await session.commitTransaction();
    session.endSession();

    return (
      await (
        await booking[0].populate("user", "name email phone address")
      ).populate("tour", "title location costFrom")
    ).populate("payment");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const bookingServices = {
  createBooking,
};

export default bookingServices;
