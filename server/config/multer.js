// config/multer.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage engine (applies to all routes)
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "odoo", // common folder for uploads
      resource_type: "auto", // auto-detect image, video, pdf, etc.
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf", "doc", "docx"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`, // unique file name
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    console.log("Processing upload:", file.originalname, file.mimetype);
    cb(null, true);
  },
});

export default upload;
