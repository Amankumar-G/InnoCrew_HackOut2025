import express from "express";
import passport from "passport";
import Plantation from "../Schema/Plantation.js";
import upload from "../config/multer.js";

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

export default router;