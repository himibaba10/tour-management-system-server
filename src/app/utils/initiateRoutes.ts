import { Application } from "express";
import userRoutes from "../modules/user/user.route";

const initiateRoutes = (app: Application) => {
  const apiVersion = "/api/v1";

  app.use(`${apiVersion}/users`, userRoutes);
};

export default initiateRoutes;
