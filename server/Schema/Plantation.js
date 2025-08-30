import mongoose from "mongoose";

const { Schema } = mongoose;

const PlantationSchema = new Schema(
  {
    // === Basic Plantation Details ===
    projectOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plantationName: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String },
    },
    area: { type: Number, required: true }, // in hectares
    species: [{ type: String, required: true }], // list of mangrove species
    plantingDate: { type: Date, required: true },
    survivalRate: { type: Number, default: 0 }, // percentage, to be verified later
    expectedCarbonCredit: { type: Number }, // optional initial estimate

    // === Status & Verification ===
    status: {
      type: String,
      enum: [
        "pending_verification",
        "verified_by_ai",
        "approved_by_admin",
        "rejected",
        "under_review",
        "admin_verification_needed",
      ],
      default: "pending_verification",
    },
    verificationNotes: { type: String },

    // === Evidence / Proofs ===
    images: [{ type: String }], // URLs of plantation photos
    soilCertificate: { type: String }, // URL or file path
    plantCertificate: { type: String }, // URL or file path of saplings certificate
    additionalDocs: [{ type: String }], // optional miscellaneous docs

    // === AI Verification Context ===
    aiVerified: { type: Boolean, default: false },
    aiScore: { type: Number, min: 0, max: 100 },
    severityFlags: [{ type: String }],
    verificationTimestamp: { type: Date },
    verificationSummary: { type: Object }, // store summary

    // === Admin Interaction ===
    adminApproved: { type: Boolean },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminComment: { type: String },

    // === Carbon Credit Integration ===
    carbonCreditGenerated: { type: Number, default: 0 }, // in tons CO2
    marketplaceStatus: {
      type: String,
      enum: ["not_listed", "listed", "sold", "delisted"],
      default: "not_listed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plantation", PlantationSchema);
