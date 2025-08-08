import { Router } from "express";
import { checkAuth } from "../../middlewares/auth";
import { Role } from "../user/user.interface";
import validateRequest from "../../utils/validateRequest";
import divisionValidations from "./division.validation";
import divisionControllers from "./division.controller";
import multerUpload from "../../configs/multer";

const divisionRoutes = Router();

divisionRoutes.get("/", divisionControllers.getAllDivisions);
divisionRoutes.get("/:slug", divisionControllers.getSingleDivision);

divisionRoutes.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(divisionValidations.createDivisionSchema),
  divisionControllers.createDivision
);

divisionRoutes.patch(
  "/:divisionId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(divisionValidations.updateDivisionSchema),
  divisionControllers.updateDivision
);

divisionRoutes.delete(
  "/:divisionId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionControllers.deleteDivision
);

export default divisionRoutes;
