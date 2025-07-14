import dotenv from "dotenv";
dotenv.config();

const envVars = {
  PORT: process.env.PORT || "3000",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "mongodb://localhost:27017/tour-management-system",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "your_jwt_access_secret",
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || "1d",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "your_jwt_REFRESH_secret",
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || "30d",
  NODE_ENV: process.env.NODE_ENV || "development",
  SALT: process.env.SALT || 10,
};

export default envVars;
