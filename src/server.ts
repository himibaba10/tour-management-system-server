import { Application } from "express";
import http from "http";
import mongoose from "mongoose";
const PORT = process.env.PORT || 3000;

const startServer = (app: Application) => {
  let server = http.createServer(app);
  try {
    mongoose.connect(process.env.DATABASE_URL as string);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

export default startServer;
