import { BOOKING_STATUS } from "../booking/booking.interface";
import Booking from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import Payment from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.PAID,
      },
      { session, new: true, runValidators: true }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        bookingStatus: BOOKING_STATUS.COMPLETE,
      },
      {
        session,
        new: true,
        runValidators: true,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Payment successful" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.FAILED,
      },
      { session, runValidators: true }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        bookingStatus: BOOKING_STATUS.FAILED,
      },
      {
        session,
        runValidators: true,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment failed" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },
      { session, runValidators: true }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        bookingStatus: BOOKING_STATUS.CANCEL,
      },
      {
        session,
        runValidators: true,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment cancelled" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const paymentServices = {
  successPayment,
  failPayment,
  cancelPayment,
};

export default paymentServices;
