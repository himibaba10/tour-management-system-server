import { Application } from "express";
import http from "http";
import mongoose from "mongoose";
const PORT = process.env.PORT || 3000;

const startServer = (app: Application) => {
  const server = http.createServer(app);
  try {
    mongoose.connect(process.env.DATABASE_URL as string);

    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${PORT}`);
    });

    process.on("SIGTERM", () => {
      // eslint-disable-next-line no-console
      console.error("SIGTERM detected! Server shutting down...");
      server.close(() => {
        process.exit(1);
      });
    });

    process.on("SIGINT", () => {
      // eslint-disable-next-line no-console
      console.error("SIGINT detected! Server shutting down...");
      server.close(() => {
        process.exit(1);
      });
    });

    process.on("unhandledRejection", (err) => {
      // eslint-disable-next-line no-console
      console.error(
        "Unhandled Rejection detected! Server shutting down...",
        err
      );
      server.close(() => {
        process.exit(1);
      });
    });

    process.on("uncaughtException", (err) => {
      // eslint-disable-next-line no-console
      console.error(
        "Uncaught exception detected! Server shutting down...",
        err
      );
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export default startServer;
