// models/Complaint.js
import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who registered the complaint

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
    verified: { type: Boolean, default: false },
    imageCheck: { type: Boolean, default: false },
    geoCheck: { type: Boolean, default: false },
    textCheck: { type: Boolean, default: false },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    confidenceScore: { type: Number, default: 0 },
    verificationSummary: {
      complaintId: { type: String },
      timestamp: { type: Date },
      status: { type: String, enum: ["pending_verification", "under_review", "verified", "rejected", "resolved"] },
      severity: { type: String, enum: ["low", "medium", "high"] },
      checks: { type: mongoose.Schema.Types.Mixed }, // For storing object/array of checks
      finalVerification: { type: mongoose.Schema.Types.Mixed },
      verificationComplete: { type: Boolean, default: false }
    },
    fullAnalysis: {
      imageAnalysis: { type: mongoose.Schema.Types.Mixed },
      geoValidation: { type: mongoose.Schema.Types.Mixed },
      textAnalysis: { type: mongoose.Schema.Types.Mixed },
      finalVerification: { type: mongoose.Schema.Types.Mixed }
    }
  }
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);
