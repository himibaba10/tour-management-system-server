import { Router } from "express";
import userControllers from "./user.controller";
import userValidations from "./user.validation";
import validateRequest from "../../utils/validateRequest";
import { checkAuth } from "../../middlewares/auth";
import { Role } from "./user.interface";

const userRoutes = Router();

userRoutes.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  userControllers.getUsers
);

userRoutes.post(
  "/register",
  validateRequest(userValidations.createUserZodSchema),
  userControllers.createUser
);

userRoutes.patch(
  "/:userId",
  checkAuth(),
  validateRequest(userValidations.updateUserZodSchema),
  userControllers.updateUser
);

export default userRoutes;
