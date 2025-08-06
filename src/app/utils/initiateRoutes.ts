import { Application, Request, Response } from "express";
import userRoutes from "../modules/user/user.route";
import authRoutes from "../modules/auth/auth.route";
import divisionRoutes from "../modules/division/division.route";
import tourRoutes from "../modules/tour/tour.route";
import bookingRoutes from "../modules/booking/booking.route";
import paymentRoutes from "../modules/payment/payment.route";

const initiateRoutes = (app: Application) => {
  const apiVersion = "/api/v1";

  app.get("/", (_req: Request, res: Response) => {
    res.send("Hello, World!");
  });

  app.use(`${apiVersion}/users`, userRoutes);
  app.use(`${apiVersion}/auth`, authRoutes);
  app.use(`${apiVersion}/division`, divisionRoutes);
  app.use(`${apiVersion}/tour`, tourRoutes);
  app.use(`${apiVersion}/booking`, bookingRoutes);
  app.use(`${apiVersion}/payment`, paymentRoutes);
};

export default initiateRoutes;
