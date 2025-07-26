import { Router } from "express";
import { checkAuth } from "../../middlewares/auth";
import { Role } from "../user/user.interface";
import validateRequest from "../../utils/validateRequest";
import divisionValidations from "./division.validation";
import divisionControllers from "./division.controller";

const divisionRoutes = Router();

divisionRoutes.get("/", divisionControllers.getAllDivisions);
divisionRoutes.get("/:slug", divisionControllers.getSingleDivision);

divisionRoutes.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(divisionValidations.createDivisionSchema),
  divisionControllers.createDivision
);

divisionRoutes.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(divisionValidations.updateDivisionSchema),
  divisionControllers.updateDivision
);

divisionRoutes.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionControllers.deleteDivision
);

export default divisionRoutes;
