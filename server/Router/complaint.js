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
      console.log("🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃🙃hiiiiiiiiii");
      const { description, category, location, damageEstimate, landmark } =
        req.body;

      // Map uploaded media files
      const mediaFiles = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        type: file.mimetype.startsWith("video") ? "video" : "photo",
      const mediaFiles = req.files.map(file => ({
        url: file.path,
        type: file.mimetype.startsWith("video") ? "video" : "photo"
      }));

      // Include user ID from authenticated JWT
      const complaint = new Complaint({
        user: req.user._id, // <-- store the user ID
        description,
        category,
        location: JSON.parse(location),
        media: mediaFiles,
        damageEstimate,
        landmark,
      });

      await complaint.save();
      console.log("hiiiiii");

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
