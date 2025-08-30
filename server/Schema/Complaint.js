// models/Complaint.js
import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["cutting", "dumping", "pollution", "fire", "other"], 
    required: true 
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  media: [
    {
      url: { type: String }, // uploaded file link (S3/Cloudinary)
      type: { type: String, enum: ["photo", "video"] }
    }
  ],
  timestamp: { type: Date, default: Date.now },
  damageEstimate: { type: String, enum: ["small", "medium", "large"], default: "small" },
  landmark: { type: String },

  // AI workflow fields
  status: { 
    type: String, 
    enum: ["pending_verification", "under_review", "verified", "rejected", "resolved"], 
    default: "pending_verification" 
  },
  verification: {
    imageCheck: { type: Boolean, default: false },
    geoCheck: { type: Boolean, default: false },
    textCheck: { type: Boolean, default: false },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    confidenceScore: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);
