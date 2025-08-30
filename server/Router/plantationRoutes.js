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
      .populate("projectOwnerId", "name email role")
      .select(
        "plantationName location area species plantingDate survivalRate status images soilCertificate plantCertificate additionalDocs carbonCreditGenerated marketplaceStatus createdAt"
      )
      .sort({ createdAt: -1 });
    

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

router.put(
  "/:id/status",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminComment } = req.body;

      // Fetch user role
      const userData = await User.findById(req.user._id).select(
        "-password -__v -createdAt -updatedAt"
      );

      if (!userData || userData.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }

      // Allowed input from admin
      const allowedStatuses = ["approved", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res
          .status(400)
          .json({ error: "Admin can only approve or reject plantations" });
      }

      const plantation = await Plantation.findById(id);
      if (!plantation) {
        return res.status(404).json({ error: "Plantation not found" });
      }

      // Prevent update if plantation is under_review
      if (plantation.status === "under_review") {
        return res.status(400).json({
          error:
            "Cannot update plantation status while it is in under_review state",
        });
      }

      // Map simple admin status → schema status
      let newStatus;
      if (status === "approved") {
        newStatus = "approved_by_admin";
        plantation.marketplaceStatus = "listed"; // ✅ auto-list marketplace
        plantation.adminApproved = true;
      } else if (status === "rejected") {
        newStatus = "rejected";
        plantation.marketplaceStatus = "not_listed"; // ✅ ensure stays hidden
        plantation.adminApproved = false;
      }

      // Update
      plantation.status = newStatus;
      plantation.adminId = req.user._id;
      if (adminComment) plantation.adminComment = adminComment;

      await plantation.save();

      return res.json({
        message: `Plantation ${status} successfully`,
        plantation,
      });
    } catch (error) {
      console.error("Error updating plantation status:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);



export default router;