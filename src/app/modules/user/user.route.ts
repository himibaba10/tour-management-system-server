import { Router } from "express";
import userControllers from "./user.controller";
import userValidations from "./user.validation";
import validateRequest from "../../utils/validateRequest";

const userRoutes = Router();

userRoutes.get("/", userControllers.getUsers);

userRoutes.post(
  "/register",
  validateRequest(userValidations.createUserZodSchema),
  userControllers.createUser
);

export default userRoutes;
