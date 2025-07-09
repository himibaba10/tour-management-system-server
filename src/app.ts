import express, { Application } from "express";
import startServer from "./server";
import initiateMiddlewares from "./app/utils/initiateMiddlewares";

const app: Application = express();

initiateMiddlewares(app);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

startServer(app);
