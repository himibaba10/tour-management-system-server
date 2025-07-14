import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const initiateMiddlewares = (app: Application) => {
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
};

export default initiateMiddlewares;
