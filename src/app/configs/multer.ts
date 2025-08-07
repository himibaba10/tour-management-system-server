import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinaryUpload from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .replace(/[^a-zA-Z0-9.\s]/g, "")
        .toLowerCase()
        .replace(/\s/g, "-")
        .split(".");

      fileName.pop();

      const uniqueFileName =
        fileName.join("-") + "-" + Math.random().toString(36).substring(2, 10);

      return uniqueFileName;
    },
  },
});

const multerUpload = multer({ storage });

export default multerUpload;
