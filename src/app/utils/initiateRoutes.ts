import { Application, Request, Response } from "express";
import userRoutes from "../modules/user/user.route";

const initiateRoutes = (app: Application) => {
  const apiVersion = "/api/v1";

  app.get("/", (_req: Request, res: Response) => {
    res.send("Hello, World!");
  });

  app.use(`${apiVersion}/users`, userRoutes);
};

export default initiateRoutes;
