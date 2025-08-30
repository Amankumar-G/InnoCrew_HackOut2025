// routes/complaints.js
import express from "express";
import Complaint from "../Schema/Complaint.js";
import upload from "../config/multer.js"; // for media uploads

const router = express.Router();

router.post("/", upload.array("media"), async (req, res) => {
  try {
    const { description, category, location, damageEstimate, landmark } = req.body;

    const mediaFiles = req.files.map(file => ({
      url: `/uploads/${file.filename}`, 
      type: file.mimetype.startsWith("video") ? "video" : "photo"
    }));

    const complaint = new Complaint({
      description,
      category,
      location: JSON.parse(location),
      media: mediaFiles,
      damageEstimate,
      landmark
    });

    await complaint.save();

    return res.status(201).json({
      message: "Complaint submitted successfully",
      complaintId: complaint._id,
      status: complaint.status
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
