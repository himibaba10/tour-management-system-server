import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import paymentServices from "./payment.service";
import envVars from "../../configs/env";
import sendResponse from "../../utils/sendResponse";
import sslCommerzServices from "../sslCommerz/sslCommerz.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.initPayment(
    req.params.bookingId as string
  );

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const { success, message } = await paymentServices.successPayment(
    req.query as Record<string, string>
  );

  if (success)
    res.redirect(
      `${envVars.SSL_SUCCESS_FRONTEND_URL}?transactionId=${req.query.transactionId}&message=${message}&amount=${req.query.amount}&status=success`
    );
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const { success, message } = await paymentServices.failPayment(
    req.query as Record<string, string>
  );

  if (!success)
    res.redirect(
      `${envVars.SSL_FAIL_FRONTEND_URL}?transactionId=${req.query.transactionId}&message=${message}&amount=${req.query.amount}&status=failed`
    );
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const { success, message } = await paymentServices.cancelPayment(
    req.query as Record<string, string>
  );

  if (!success)
    res.redirect(
      `${envVars.SSL_CANCEL_FRONTEND_URL}?transactionId=${req.query.transactionId}&message=${message}&amount=${req.query.amount}&status=cancelled`
    );
});

const getInvoiceDownloadUrl = catchAsync(
  async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId;
    const result = await paymentServices.getInvoiceDownloadUrl(paymentId);

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Invoice URL got successfully",
      data: result,
    });
  }
);

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  await sslCommerzServices.validatePayment(req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Payment validated successfully",
    data: null,
  });
});

const paymentControllers = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  getInvoiceDownloadUrl,
  validatePayment,
};

export default paymentControllers;
