// routes/complaints.js
import express from "express";
import passport from "passport";
import Complaint from "../Schema/Complaint.js";
import upload from "../config/multer.js"; // for media uploads

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.array("media"),
  async (req, res) => {
    try {
      const { description, category, location, damageEstimate, landmark } =
        req.body;

      // Map uploaded media files
      // Map uploaded media files (Cloudinary URLs)
      const mediaFiles = req.files.map((file) => ({
        url: file.path || file.secure_url, // Cloudinary gives path or secure_url
        type: file.mimetype.startsWith("video") ? "video" : "photo",
      }));

      // Include user ID from authenticated JWT
      const complaint = new Complaint({
        user: req.user._id,
        description,
        category,
        location: JSON.parse(location),
        media: mediaFiles,
        damageEstimate,
        landmark,
      });

      await complaint.save();

      return res.status(201).json({
        message: "Complaint submitted successfully",
        complaintId: complaint._id,
        status: complaint.status,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;
