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
  app.set("trust proxy", 1);
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: envVars.FRONTEND_URI,
      credentials: true,
    })
  );
  app.use(cookieParser());
};

export default initiateMiddlewares;
