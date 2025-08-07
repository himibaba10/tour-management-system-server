/* eslint-disable no-console */
import httpStatus from "http-status-codes";
import cloudinaryUpload from "../configs/cloudinary";
import AppError from "./AppError";

const deleteImageFromCloudinary = async (url: string) => {
  try {
    const publicId = url.split("/").pop()!.split(".")[0];

    await cloudinaryUpload.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Failed to delete image from Cloudinary",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export default deleteImageFromCloudinary;
