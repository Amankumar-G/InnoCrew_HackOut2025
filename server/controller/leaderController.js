// controller/leaderController.js
import User from "../Schema/User.js"

const leaderBoard = async (req, res) => {
  try {
    // 1. Get top 10 users sorted by points
    const topUsers = await User.find()
      .sort({ points: -1 })
      .limit(10)
      .select("-password -__v -createdAt -updatedAt");

    // 2. Get current user details
    const currentUser = await User.findById(req.user._id).select(
      "-password -__v -createdAt -updatedAt"
    );

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Find current user's rank
    const userRank =
      (await User.countDocuments({ points: { $gt: currentUser.points } })) + 1;

    return res.json({
      success: true,
      leaderboard: topUsers,
      currentUser: {
        ...currentUser.toObject(),
        rank: userRank,
      },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default leaderBoard;
