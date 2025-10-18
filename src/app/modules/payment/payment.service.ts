import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import Booking from "../booking/booking.model";
import sslCommerzServices from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import Payment from "./payment.model";
import { IUser } from "../user/user.interface";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import generatePdf, { IInvoiceData } from "../../utils/generatePdf";
import { ITour } from "../tour/tour.interface";
import sendEmail from "../../utils/sendEmail";
import uploadBufferToCloudinary from "../../utils/uploadBufferToCloudinary";

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

    const updatedBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        bookingStatus: BOOKING_STATUS.COMPLETE,
      },
      {
        session,
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "name email")
      .populate("tour", "title");

    if (!updatedBooking || !updatedPayment) {
      throw new AppError("Booking or payment not found", httpStatus.NOT_FOUND);
    }

    const invoiceData: IInvoiceData = {
      transactionId: query.transactionId,
      username: (updatedBooking.user as unknown as IUser).name,
      bookingDate: updatedBooking.createdAt as Date,
      guestCount: updatedBooking.guestCount,
      totalCost: updatedPayment.amount,
      tourTitle: (updatedBooking.tour as unknown as ITour).title,
    };

    const pdfBuffer = await generatePdf(invoiceData);

    const cloudinaryResult = (await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice"
    )) as { secure_url: string };

    updatedPayment.invoiceUrl = cloudinaryResult.secure_url;

    await sendEmail({
      to: (updatedBooking.user as unknown as IUser).email,
      subject: "Booking invoice",
      templateName: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          contentType: "application/pdf",
          content: pdfBuffer,
        },
      ],
    });

    await updatedPayment.save({ session });
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

const getInvoiceDownloadUrl = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId);

  if (!payment || !payment.invoiceUrl) {
    throw new AppError("Invoice not found", httpStatus.NOT_FOUND);
  }
  return payment.invoiceUrl;
};

const paymentServices = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  getInvoiceDownloadUrl,
};

export default paymentServices;
