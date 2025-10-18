import { Router } from "express";
import statsControllers from "./stats.controller";
import { checkAuth } from "../../middlewares/auth";
import { Role } from "../user/user.interface";

const statsRoutes = Router();

statsRoutes.get(
  "/user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  statsControllers.getUserStats
);

statsRoutes.get(
  "/tour",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  statsControllers.getTourStats
);

export default statsRoutes;
