/* eslint-disable no-console */

import http from "http";

const shutDownServer = (server: http.Server) => {
  process.on("SIGTERM", () => {
    console.error("SIGTERM detected! Server shutting down...");
    server.close(() => {
      process.exit(1);
    });
  });

  process.on("SIGINT", () => {
    console.error("SIGINT detected! Server shutting down...");
    server.close(() => {
      process.exit(1);
    });
  });

  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection detected! Server shutting down...", err);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception detected! Server shutting down...", err);
    server.close(() => {
      process.exit(1);
    });
  });
};

export default shutDownServer;
