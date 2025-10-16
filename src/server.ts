/* eslint-disable no-console */
import { Application } from "express";
import http from "http";
import mongoose from "mongoose";
import envVars from "./app/configs/env";
import shutDownServer from "./app/utils/shutDownServer";
import connectRedis from "./app/configs/redis";
const PORT = process.env.PORT || 3000;

const startServer = async (app: Application) => {
  const server = http.createServer(app);
  try {
    await connectRedis();

    mongoose.connect(envVars.DATABASE_URL);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    shutDownServer(server);
  } catch (error) {
    console.error(error);
  }
};

export default startServer;
