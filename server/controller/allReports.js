// controllers/complaintController.js
import Complaint from  "../Schema/Complaint.js";
import User from "../Schema/User.js"

// @route GET /api/complaints
export const getAllComplaints = async (req, res) => {
  try {
    // get logged-in user details from token
    const userData = await User.findById(req.user._id).select(
      "-password -__v -createdAt -updatedAt"
    );

    let complaints;

    if (userData.role === "admin") {
      // admin => get all complaints
      complaints = await Complaint.find().sort({ createdAt: -1 });
    } else {
      // normal user => get only their complaints
      complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @route GET /api/complaints/:id
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }
    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

