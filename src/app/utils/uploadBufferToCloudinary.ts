/* eslint-disable no-console */
import httpStatus from "http-status-codes";
import AppError from "./AppError";
import stream from "stream";
import cloudinaryUpload from "../configs/cloudinary";

const uploadBufferToCloudinary = (buffer: Buffer, foldername: string) => {
  try {
    return new Promise((resolve, reject) => {
      const publicId = `${foldername}-${new Date()}`;

      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      cloudinaryUpload.uploader
        .upload_stream(
          {
            public_id: publicId,
            folder: "pdf",
            resource_type: "auto",
          },
          (err, result) => {
            if (err) return reject(err);
            return resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Cloudinary Buffer upload failed",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export default uploadBufferToCloudinary;
