import cron from "node-cron";
import Plantation from "../Schema/Plantation.js";
import User from "../Schema/User.js";
import { runPlantationVerificationWorkflow } from "../services/plantationAiVerification.js";

// Run every 30 seconds for testing → "*/30 * * * * *"
const plantationCronJob = cron.schedule(
  "*/30 * * * * *",
  async () => {
    console.log(
      "\n🌱 [PLANTATION CRON START] Checking for unverified plantations..."
    );

    try {
      const plantations = await Plantation.find({
        status: "pending_verification",
      }).limit(5); // Process 5 at a time to avoid overwhelming

      if (plantations.length === 0) {
        console.log("📭 No pending plantations found");
        console.log(
          "✅ [PLANTATION CRON END] Nothing to process this cycle.\n"
        );
        return;
      }

      console.log(`🌳 Found ${plantations.length} plantations to process`);

      for (let plantation of plantations) {
        try {
          console.log(`\n--- Processing plantation ID: ${plantation._id} ---`);
          console.log(`📍 Plantation: ${plantation.plantationName}`);

          // Step 1: Set status to under review
          plantation.status = "under_review";
          await plantation.save();
          console.log("✅ Status updated to under_review");

          // Step 2: Run AI verification workflow
          console.log(
            "🤖 Running AI multi-agent plantation verification workflow..."
          );
          const verificationResult = await runPlantationVerificationWorkflow(
            plantation
          );
          console.log("📊 Verification Result:", verificationResult);

          // Step 3: Map AI result to plantation schema
          const verificationData = {
            aiVerified: verificationResult.verified || false,
            aiScore: verificationResult.data?.overallScore || 0,
            dataValidation: verificationResult.data?.dataValidation || false,
            imageValidation: verificationResult.data?.imageValidation || false,
            documentValidation:
              verificationResult.data?.documentValidation || false,
            locationValidation:
              verificationResult.data?.locationValidation || false,
            carbonCreditGenerated:
              verificationResult.data?.carbonCreditGenerated || 0,
            confidenceScore: verificationResult.data?.confidenceScore || 0,
            verificationSummary:
              verificationResult.data?.verificationSummary || {},
            fullAnalysis: verificationResult.data?.fullAnalysis || {},
            severityFlags: verificationResult.data?.severityFlags || [],
          };

          // Step 4: Determine final status based on verification
          let finalStatus = "pending_verification";
          if (verificationData.aiScore >= 80) {
            finalStatus = "verified_by_ai";
          } else if (verificationData.aiScore >= 60) {
            finalStatus = "admin_verification_needed"; // Manual review needed
          } else {
            finalStatus = "rejected";
          }

          // Step 5: Update plantation with verification results
          plantation.status = finalStatus;
          plantation.aiVerified = verificationData.aiVerified;
          plantation.aiScore = verificationData.aiScore;
          plantation.carbonCreditGenerated =
            verificationData.carbonCreditGenerated;
          plantation.verificationTimestamp = new Date();
          plantation.verificationNotes =
            verificationResult.data?.summary ||
            `AI Verification completed with score: ${verificationData.aiScore}/100`;
          plantation.severityFlags = verificationData.severityFlags;

          // NEW: store the full verification data and summary
          plantation.verificationSummary = verificationData.verificationSummary;

          await plantation.save();

          console.log(
            `✅ Plantation ${plantation._id} updated → Status: ${plantation.status}, Score: ${plantation.aiScore}`
          );

          // Step 6: Update user carbon credits and points if verified
          if (verificationData.aiVerified && plantation.projectOwnerId) {
            const user = await User.findById(plantation.projectOwnerId);
            if (user) {
              // 🌱 Carbon credits based on area and species
              const carbonCreditsToAdd = verificationData.carbonCreditGenerated;

              // 🎯 Points logic based on verification score
              let pointsToAdd = 0;
              if (verificationData.aiScore >= 90) {
                pointsToAdd = 50; // Excellent plantation
              } else if (verificationData.aiScore >= 80) {
                pointsToAdd = 30; // Good plantation
              } else if (verificationData.aiScore >= 70) {
                pointsToAdd = 20; // Acceptable plantation
              } else {
                pointsToAdd = 10; // Minimal points
              }

              // Bonus points for large plantations
              if (plantation.area >= 5) {
                pointsToAdd += 20; // Large scale bonus
              } else if (plantation.area >= 2) {
                pointsToAdd += 10; // Medium scale bonus
              }

              user.carbonCredits = user.carbonCredits || { earned: 0, used: 0 };
              user.carbonCredits.earned += carbonCreditsToAdd;
              user.points = (user.points || 0) + pointsToAdd;

              await user.save();

              console.log(
                `🌱 User ${user._id} credited with ${carbonCreditsToAdd} carbon credits`
              );
              console.log(
                `🎯 User ${user._id} awarded ${pointsToAdd} points (score: ${verificationData.aiScore})`
              );
            } else {
              console.warn(
                `⚠️ User not found for plantation ${plantation._id}`
              );
            }
          }

          // Step 7: Handle marketplace listing for verified plantations
          if (
            verificationData.aiVerified &&
            verificationData.carbonCreditGenerated > 0
          ) {
            plantation.marketplaceStatus = "listed";
            await plantation.save();
            console.log(
              `🏪 Plantation ${plantation._id} listed in marketplace`
            );
          }
        } catch (plantationError) {
          console.error(
            `❌ Error processing plantation ${plantation._id}:`,
            plantationError.message
          );

          // Reset status on error
          console.log("↩️ Resetting status back to pending_verification...");
          try {
            plantation.status = "pending_verification";
            await plantation.save();
            console.log("✅ Reset successful");
          } catch (resetError) {
            console.error(
              `❌ Failed to reset plantation ${plantation._id} status:`,
              resetError.message
            );
          }
        }
      }

      console.log("✅ [PLANTATION CRON END] Cycle completed.\n");
    } catch (error) {
      console.error("❌ Plantation cron job error:", error.message);
    }
  },
  {
    scheduled: false,
    timezone: "UTC",
  }
);

// Start the cron job
plantationCronJob.start();
console.log(
  "🚀 Plantation verification cron job started (runs every 30 seconds)"
);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Stopping plantation cron job...");
  plantationCronJob.stop();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Stopping plantation cron job...");
  plantationCronJob.stop();
  process.exit(0);
});

export default plantationCronJob;
