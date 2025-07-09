import express, { Application } from "express";
import startServer from "./server";
import initiateMiddlewares from "./app/utils/initiateMiddlewares";
import initiateRoutes from "./app/utils/initiateRoutes";

const app: Application = express();

initiateMiddlewares(app);

initiateRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

startServer(app);
