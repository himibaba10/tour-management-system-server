import { Router } from "express";
import userControllers from "./user.controller";

const userRoutes = Router();

userRoutes.get("/", userControllers.getUsers);

userRoutes.post("/register", userControllers.createUser);

export default userRoutes;
