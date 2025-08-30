import express from "express";
import passport from "passport";
import Plantation from "../Schema/Plantation.js";
import upload from "../config/multer.js";
import User from "../Schema/User.js"

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "soilCertificate", maxCount: 1 },
    { name: "plantCertificate", maxCount: 1 },
    { name: "additionalDocs", maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);

      const {
        plantationName,
        latitude,
        longitude,
        address,
        area,
        species,
        plantingDate,
        survivalRate
      } = req.body;

      const projectOwnerId = req.user._id;

      // Debug file processing
      console.log("Processing files...");
      
      // Map uploaded files to URLs with better error handling
      const images = req.files["images"]?.map(file => {
        console.log("Image file:", file);
        return file.path || file.url || file.secure_url;
      }).filter(Boolean) || [];

      const soilCertificate = req.files["soilCertificate"]?.[0] ? 
        (req.files["soilCertificate"][0].path || 
         req.files["soilCertificate"][0].url || 
         req.files["soilCertificate"][0].secure_url) : "";

      const plantCertificate = req.files["plantCertificate"]?.[0] ? 
        (req.files["plantCertificate"][0].path || 
         req.files["plantCertificate"][0].url || 
         req.files["plantCertificate"][0].secure_url) : "";

      const additionalDocs = req.files["additionalDocs"]?.map(file => {
        console.log("Additional doc file:", file);
        return file.path || file.url || file.secure_url;
      }).filter(Boolean) || [];

      console.log("Processed file URLs:");
      console.log("Images:", images);
      console.log("Soil Certificate:", soilCertificate);
      console.log("Plant Certificate:", plantCertificate);
      console.log("Additional Docs:", additionalDocs);

      const plantationData = {
        projectOwnerId,
        plantationName,
        location: { 
          latitude: parseFloat(latitude), 
          longitude: parseFloat(longitude), 
          address 
        },
        area: parseFloat(area),
        species: typeof species === "string" ? 
          species.split(",").map(s => s.trim()) : 
          (Array.isArray(species) ? species : [species]),
        plantingDate: new Date(plantingDate),
        survivalRate: parseFloat(survivalRate),
        images,
        soilCertificate,
        plantCertificate,
        additionalDocs,
        status: "pending_verification"
      };

      console.log("Final plantation data:", plantationData);

      const newPlantation = new Plantation(plantationData);
      const savedPlantation = await newPlantation.save();

      res.status(201).json({
        success: true,
        message: "Plantation submitted successfully!",
        data: savedPlantation
      });
    } catch (error) {
      console.error("Error details:", error);
      console.error("Request files:", req.files);
      console.error("Request body:", req.body);
      
      res.status(500).json({ 
        success: false, 
        message: "Server error", 
        error: error.message,
        debug: {
          filesReceived: req.files ? Object.keys(req.files) : [],
          bodyKeys: Object.keys(req.body || {})
        }
      });
    }
  }
);

// Get all plantations (admin only)
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // fetch user data to check role
      const userData = await User.findById(req.user._id).select(
        "-password -__v -createdAt -updatedAt"
      );

      if (!userData || userData.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }

      // Get all plantations with project owner populated
      const plantations = await Plantation.find()
        .populate("projectOwnerId", "name email role") // only show limited user fields
        .sort({ createdAt: -1 }); // latest first

      return res.json({
        count: plantations.length,
        plantations,
      });
    } catch (error) {
      console.error("Error fetching plantations for admin:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get user's plantations
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const plantations = await Plantation.find({ projectOwnerId: req.user._id })
        .sort({ createdAt: -1 }); // latest first

      return res.json({
        count: plantations.length,
        plantations,
      });
    } catch (error) {
      console.error("Error fetching user plantations:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get plantation by ID
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const plantation = await Plantation.findById(req.params.id)
        .populate("projectOwnerId", "name email role");

      if (!plantation) {
        return res.status(404).json({ error: "Plantation not found" });
      }

      // Check if user owns the plantation or is admin
      if (plantation.projectOwnerId._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }

      return res.json({ plantation });
    } catch (error) {
      console.error("Error fetching plantation:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Update plantation (user can update their own, admin can update any)
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const plantation = await Plantation.findById(id);

      if (!plantation) {
        return res.status(404).json({ error: "Plantation not found" });
      }

      // Check if user owns the plantation or is admin
      if (plantation.projectOwnerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }

      // Only allow updates if plantation is still pending verification
      if (plantation.status !== "pending_verification" && req.user.role !== "admin") {
        return res.status(400).json({ error: "Cannot update plantation after verification has started" });
      }

      const updatedPlantation = await Plantation.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );

      return res.json({
        message: "Plantation updated successfully",
        plantation: updatedPlantation,
      });
    } catch (error) {
      console.error("Error updating plantation:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Update plantation status (admin only)
router.put(
  "/:id/status",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminComment } = req.body;
      const userData = await User.findById(req.user._id).select(
        "-password -__v -createdAt -updatedAt"
      );

      if (!userData || userData.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }
      // Allowed status values from schema
      const allowedStatuses = [
        "pending_verification",
        "verified_by_ai",
        "approved_by_admin",
        "rejected",
        "under_review",
        "admin_verification_needed",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const plantation = await Plantation.findById(id);
      if (!plantation) {
        return res.status(404).json({ error: "Plantation not found" });
      }

      plantation.status = status;
      plantation.adminId = req.user._id;
      if (adminComment) plantation.adminComment = adminComment;

      if (status === "approved_by_admin") {
        plantation.adminApproved = true;
      } else if (status === "rejected") {
        plantation.adminApproved = false;
      }

      await plantation.save();

      return res.json({
        message: "Plantation status updated successfully",
        plantation,
      });
    } catch (error) {
      console.error("Error updating plantation status:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Delete plantation (user can delete their own, admin can delete any)
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const plantation = await Plantation.findById(id);

      if (!plantation) {
        return res.status(404).json({ error: "Plantation not found" });
      }

      // Check if user owns the plantation or is admin
      if (plantation.projectOwnerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }

      // Only allow deletion if plantation is still pending verification
      if (plantation.status !== "pending_verification" && req.user.role !== "admin") {
        return res.status(400).json({ error: "Cannot delete plantation after verification has started" });
      }

      await Plantation.findByIdAndDelete(id);

      return res.json({
        message: "Plantation deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting plantation:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;