import { Application, Request, Response } from "express";
import userRoutes from "../modules/user/user.route";
import authRoutes from "../modules/auth/auth.route";

const initiateRoutes = (app: Application) => {
  const apiVersion = "/api/v1";

  app.get("/", (_req: Request, res: Response) => {
    res.send("Hello, World!");
  });

  app.use(`${apiVersion}/users`, userRoutes);
  app.use(`${apiVersion}/auth`, authRoutes);
};

export default initiateRoutes;
