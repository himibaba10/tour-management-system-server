import express from "express";
import { Role } from "../user/user.interface";
import tourControllers from "./tour.controller";
import { checkAuth } from "../../middlewares/auth";
import validateRequest from "../../utils/validateRequest";
import tourValidations from "./tour.validation";

const tourRoutes = express.Router();

/* ------------------ TOUR TYPE ROUTES -------------------- */
tourRoutes.get("/tour-types", tourControllers.getAllTourTypes);

tourRoutes.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourValidations.createTourTypeZodSchema),
  tourControllers.createTourType
);

tourRoutes.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourValidations.createTourTypeZodSchema),
  tourControllers.updateTourType
);

tourRoutes.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourControllers.deleteTourType
);

/* --------------------- TOUR ROUTES ---------------------- */
tourRoutes.get("/", tourControllers.getAllTours);
tourRoutes.get("/:slug", tourControllers.getSingleTour);

tourRoutes.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourValidations.createTourZodSchema),
  tourControllers.createTour
);

tourRoutes.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourValidations.updateTourZodSchema),
  tourControllers.updateTour
);

tourRoutes.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourControllers.deleteTour
);

export default tourRoutes;
