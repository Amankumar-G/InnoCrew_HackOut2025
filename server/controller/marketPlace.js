// controllers/complaintController.js
import Plantination from  "../Schema/Plantination.js";

// @route GET /api/complaints
export const getAllPlantination = async (req, res) => {
  try {
    // get logged-in user details from token

    const plantinations = await Plantination.find().sort({ createdAt: -1 });
   
    res.status(200).json({
      success: true,
      count: plantinations.length,
      data: plantinations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};