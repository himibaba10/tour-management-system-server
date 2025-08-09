import { NextFunction, Request, Response, Router } from "express";
import authControllers from "./auth.controller";
import { checkAuth } from "../../middlewares/auth";
import authValidations from "./auth.validation";
import validateRequest from "../../utils/validateRequest";
import passport from "passport";
import envVars from "../../configs/env";

const authRoutes = Router();

authRoutes.post("/login", authControllers.credentialsLogin);
authRoutes.post("/refresh-token", authControllers.getNewAccessToken);
authRoutes.post("/logout", authControllers.logout);
authRoutes.post(
  "/set-password",
  checkAuth(),
  validateRequest(authValidations.setPasswordZodSchema),
  authControllers.setPassword
);
authRoutes.post(
  "/reset-password",
  checkAuth(),
  validateRequest(authValidations.resetPasswordZodSchema),
  authControllers.resetPassword
);
authRoutes.post(
  "/change-password",
  checkAuth(),
  validateRequest(authValidations.changePasswordZodSchema),
  authControllers.changePassword
);
authRoutes.post(
  "/forgot-password",
  validateRequest(authValidations.forgotPasswordZodSchema),
  authControllers.forgotPassword
);

// Routes for Google
authRoutes.get("/google", (req: Request, res: Response, next: NextFunction) => {
  let redirect = (req.query.redirect as string) || "/";

  if (!redirect.startsWith("/")) {
    redirect = "/" + redirect;
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect,
  })(req, res, next);
});

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URI}/login?error=There has been some issues in your account. Please contact support.`,
  }),
  authControllers.googleCallback
);

export default authRoutes;
