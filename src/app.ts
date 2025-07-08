import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import startServer from "./server";

const app: Application = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

startServer(app);
