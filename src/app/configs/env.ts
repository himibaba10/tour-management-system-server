import dotenv from "dotenv";
dotenv.config();

const envVars = {
  PORT: process.env.PORT || "3000",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "mongodb://localhost:27017/tour-management-system",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default envVars;
