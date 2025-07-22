import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";

const initiateMiddlewares = (app: Application) => {
  app.use(
    expressSession({
      secret: "Your secret",
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
