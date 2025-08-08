import httpStatus from "http-status-codes";
import cloudinaryUpload from "../configs/cloudinary";
import AppError from "./AppError";

const deleteImageFromCloudinary = async (url: string) => {
  try {
    const publicId = new URL(url).pathname.split("/").pop()!.split(".")[0];

    await cloudinaryUpload.uploader.destroy(publicId);
  } catch (error: any) {
    throw new AppError(
      `Failed to delete image from Cloudinary - ${error.message}`,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export default deleteImageFromCloudinary;
