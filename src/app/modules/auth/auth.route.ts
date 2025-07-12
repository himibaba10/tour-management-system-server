import { Router } from "express";
import authControllers from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/login", authControllers.credentialsLogin);

export default authRoutes;
