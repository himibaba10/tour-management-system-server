import express, { Application } from "express";
import startServer from "./server";
import initiateMiddlewares from "./app/utils/initiateMiddlewares";
import initiateRoutes from "./app/utils/initiateRoutes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundHandler from "./app/middlewares/notFoundHandler";

const app: Application = express();

initiateMiddlewares(app);

initiateRoutes(app);

app.use(notFoundHandler);

app.use(globalErrorHandler);

startServer(app);
