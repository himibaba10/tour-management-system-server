import { Router } from "express";
import authControllers from "./auth.controller";
import { checkAuth } from "../../middlewares/auth";
import authValidations from "./auth.validation";
import validateRequest from "../../utils/validateRequest";

const authRoutes = Router();

authRoutes.post("/login", authControllers.credentialsLogin);
authRoutes.post("/refresh-token", authControllers.getNewAccessToken);
authRoutes.post("/logout", authControllers.logout);
authRoutes.post(
  "/reset-password",
  checkAuth(),
  validateRequest(authValidations.resetPasswordZodSchema),
  authControllers.resetPassword
);

export default authRoutes;
