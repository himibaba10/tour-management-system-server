import { Router } from "express";

const otpRoutes = Router();

otpRoutes.post("/send");
otpRoutes.post("/verify");

export default otpRoutes;
