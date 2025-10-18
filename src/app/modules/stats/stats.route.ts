import { Router } from "express";
import statsControllers from "./stats.controller";
import { checkAuth } from "../../middlewares/auth";
import { Role } from "../user/user.interface";

const statsRoutes = Router();

statsRoutes.use(checkAuth(Role.ADMIN, Role.SUPER_ADMIN));

statsRoutes.get("/user", statsControllers.getUserStats);

statsRoutes.get("/tour", statsControllers.getTourStats);

statsRoutes.get("/booking", statsControllers.getBookingStats);

export default statsRoutes;
