// controllers/complaintController.js
import Plantination from "../Schema/Plantation.js";
import User from "../Schema/User.js";

// @route GET /api/marketplace
export const marketPlace = async (req, res) => {
  try {
    // Fetch plantations with verified status
    const plantations = await Plantination.find({
      status: { $in: ["approved_by_admin", "verified_by_ai"] },
    })
      .select("location carbonCreditGenerated projectOwnerId status") // only required fields
      .sort({ createdAt: -1 });

    // Now fetch only user contact details for each projectOwnerId
    const data = await Promise.all(
      plantations.map(async (plant) => {
        const user = await User.findById(plant.projectOwnerId).select(
          "name email phone" // only required contact fields
        );

        return {
          location: plant.location,
          carbonCreditGenerated: plant.carbonCreditGenerated,
          status: plant.status,
          user: user
            ? {
                name: user.name,
                email: user.email,
                phone: user.phone,
              }
            : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
