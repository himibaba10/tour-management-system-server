import { Types } from "mongoose";

export enum PAYMENT_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED",
}

export interface Payment {
  booking: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGatewayData?: unknown;
  invoiceUrl?: string;
  status: PAYMENT_STATUS;
}
