import express, { Application } from "express";
import startServer from "./server";
import initiateMiddlewares from "./app/utils/initiateMiddlewares";
import initiateRoutes from "./app/utils/initiateRoutes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

initiateMiddlewares(app);

initiateRoutes(app);

app.use(globalErrorHandler);

startServer(app);
