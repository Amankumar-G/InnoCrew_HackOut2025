// routes/complaintRoutes.js
import express from "express";
import {
  getAllComplaints,
  getComplaintById,
} from "../controller/allReports.js";
import passport from "passport";

const router = express.Router();

// Get all complaints
router.get("/", passport.authenticate("jwt", { session: false }),getAllComplaints);

// Get single complaint by ID
router.get("/:id", getComplaintById);


export default router;
