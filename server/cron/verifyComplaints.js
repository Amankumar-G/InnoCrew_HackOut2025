// cron/verifyComplaints.js
import cron from "node-cron";
import Complaint from "../Schema/Complaint.js"; 
import User from "../Schema/User.js";
import { runVerificationWorkflow } from "../services/aiVerification.js";

// Run every 10 seconds for testing → "*/10 * * * * *"
const cronJob = cron.schedule(
  "*/10 * * * * *",
  async () => {
    console.log("\n🔍 [CRON START] Checking for unverified complaints...");

    try {
      const complaints = await Complaint.find({ status: "pending_verification" }).limit(10);

      if (complaints.length === 0) {
        console.log("📭 No pending complaints found");
        console.log("✅ [CRON END] Nothing to process this cycle.\n");
        return;
      }

      console.log(`📋 Found ${complaints.length} complaints to process`);

      for (let complaint of complaints) {
        try {
          console.log(`\n--- Processing complaint ID: ${complaint._id} ---`);

          // Step 1: Set status to under_review
          complaint.status = "under_review";
          await complaint.save();
          console.log("✅ Status updated to under_review");

          // Step 2: Run AI verification
          console.log("🤖 Running AI multi-agent verification workflow...");
          const verificationResult = await runVerificationWorkflow(complaint);
          console.log("📊 Verification Result:", verificationResult);

          // Step 3: Map AI result to schema
          const verificationData = {
            verified: verificationResult.verified || false,
            imageCheck: verificationResult.data?.imageCheck || false,
            geoCheck: verificationResult.data?.geoCheck || false,
            textCheck: verificationResult.data?.textCheck || false,
            severity: verificationResult.data?.severity || "low",
            carbonCreditsEarned: verificationResult.data?.carbonCreditsEarned || 0,
            confidenceScore: verificationResult.data?.confidenceScore || 0,
            verificationSummary: verificationResult.data?.verificationSummary || {},
            fullAnalysis: verificationResult.data?.fullAnalysis || {}
          };

          // Step 4: Update complaint with verification results
          complaint.status = verificationData.verified ? "verified" : "rejected";
          complaint.verification = verificationData;
          await complaint.save();

          console.log(`✅ Complaint ${complaint._id} updated → Status: ${complaint.status}`);

          // Step 5: Add carbon credits to user if verified
          if (verificationData.verified && complaint.user) {
            const user = await User.findById(complaint.user);
            if (user) {
              user.carbonCredits.earned += verificationData.carbonCreditsEarned;
              await user.save();
              console.log(`🌱 User ${user._id} credited with ${verificationData.carbonCreditsEarned} carbon credits`);
            } else {
              console.warn(`⚠️ User not found for complaint ${complaint._id}`);
            }
          }

        } catch (complaintError) {
          console.error(`❌ Error processing complaint ${complaint._id}:`, complaintError.message);

          console.log("↩️ Resetting status back to pending_verification...");
          try {
            complaint.status = "pending_verification";
            await complaint.save();
            console.log("✅ Reset successful");
          } catch (resetError) {
            console.error(`❌ Failed to reset complaint ${complaint._id} status:`, resetError.message);
          }
        }
      }

      console.log("✅ [CRON END] Cycle completed.\n");
    } catch (error) {
      console.error("❌ Cron job error:", error.message);
    }
  },
  {
    scheduled: false,
    timezone: "UTC",
  }
);

// Start the cron job
cronJob.start();
console.log("🚀 Complaint verification cron job started (runs every 10 seconds)");

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Stopping cron job...");
  cronJob.stop();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Stopping cron job...");
  cronJob.stop();
  process.exit(0);
});

export default cronJob;
