import express from "express";
import paymentControllers from "./payment.controller";
import { checkAuth } from "../../middlewares/auth";

const paymentRoutes = express.Router();

paymentRoutes.post("/init-payment/:bookingId", paymentControllers.initPayment);

paymentRoutes.post("/success", paymentControllers.successPayment);
paymentRoutes.post("/fail", paymentControllers.failPayment);
paymentRoutes.post("/cancel", paymentControllers.cancelPayment);

paymentRoutes.get(
  "/invoice/:paymentId",
  checkAuth(),
  paymentControllers.getInvoiceDownloadUrl
);

export default paymentRoutes;
