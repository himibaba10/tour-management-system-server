import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";
import "../configs/passport";
import envVars from "../configs/env";

const initiateMiddlewares = (app: Application) => {
  app.use(
    expressSession({
      secret: envVars.EXPRESS_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
};

export default initiateMiddlewares;
