import { Router } from "express";
import otpControllers from "./otp.controller";

const otpRoutes = Router();

otpRoutes.post("/send", otpControllers.sendOtp);
otpRoutes.post("/verify", otpControllers.verifyOtp);

export default otpRoutes;
