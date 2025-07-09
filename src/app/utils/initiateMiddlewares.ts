import express, { Application } from "express";
import cors from "cors";

const initiateMiddlewares = (app: Application) => {
  app.use(express.json());
  app.use(cors());
};

export default initiateMiddlewares;
