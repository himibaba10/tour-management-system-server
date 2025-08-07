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
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "your_google_client_id",
  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET || "your_google_client_secret",
  GOOGLE_CALLBACK_URI:
    process.env.GOOGLE_CALLBACK_URI || "your_google_callback_uri",
  EXPRESS_SESSION_SECRET:
    process.env.EXPRESS_SESSION_SECRET || "your_express_session_secret",
  FRONTEND_URI: process.env.FRONTEND_URI || "your_frontend_uri",
  SSL_STORE_ID: process.env.SSL_STORE_ID || "",
  SSL_STORE_PASSWORD: process.env.SSL_STORE_PASSWORD || "",
  SSL_PAYMENT_API: process.env.SSL_PAYMENT_API || "",
  SSL_VALIDATION_API: process.env.SSL_VALIDATION_API || "",
  SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL || "",
  SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL || "",
  SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL || "",
  SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL || "",
  SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL || "",
  SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
};

export default envVars;
