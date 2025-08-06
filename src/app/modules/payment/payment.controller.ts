import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import paymentServices from "./payment.service";
import envVars from "../../configs/env";

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

const paymentControllers = {
  successPayment,
  failPayment,
  cancelPayment,
};

export default paymentControllers;
