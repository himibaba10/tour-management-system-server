import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import Booking from "../booking/booking.model";
import sslCommerzServices from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import Payment from "./payment.model";
import { IUser } from "../user/user.interface";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";

const initPayment = async (bookingId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.findOne({ booking: bookingId }).session(
      session
    );

    if (!payment) {
      throw new AppError(
        "Payment not found for the given booking.",
        httpStatus.NOT_FOUND
      );
    }

    const booking = await Booking.findById(bookingId)
      .session(session)
      .populate("user");

    const sslPayload = {
      amount: payment.amount,
      transactionId: payment.transactionId,
      address: (booking!.user as unknown as IUser).address,
      name: (booking!.user as unknown as IUser).name,
      email: (booking!.user as unknown as IUser).email,
      phoneNumber: (booking!.user as unknown as IUser).phone,
    };

    const sslPayment = await sslCommerzServices.sslPaymentInit(
      sslPayload as ISSLCommerz
    );

    await session.commitTransaction();
    session.endSession();

    return {
      paymentUrl: sslPayment.GatewayPageURL,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

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
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};

export default paymentServices;
