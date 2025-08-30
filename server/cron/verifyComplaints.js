// cron/verifyComplaints.js
import cron from "node-cron";
import Complaint from "../Schema/Complaint.js";
import { runVerificationWorkflow } from "../services/aiVerification.js";

// Run every 5 minutes → "*/5 * * * *"
const cronJob = cron.schedule("*/1 * * * *", async () => {
  console.log("🔍 Checking for unverified complaints...");

  try {
    const complaints = await Complaint.find({ status: "pending_verification" }).limit(10);

    if (complaints.length === 0) {
      console.log("📭 No pending complaints found");
      return;
    }

    console.log(`📋 Found ${complaints.length} complaints to process`);

    for (let complaint of complaints) {
      try {
        console.log(`Processing complaint ID: ${complaint._id}`);

        // Mark as under_review
        complaint.status = "under_review";
        await complaint.save();

        // Run AI multi-agent workflow (mock/service call)
        const verificationResult = await runVerificationWorkflow(complaint);

        // Update with results
        complaint.status = verificationResult.verified ? "verified" : "rejected";
        complaint.verification = verificationResult.data;
        await complaint.save();

        console.log(`✅ Complaint ${complaint._id} updated: ${complaint.status}`);
      } catch (complaintError) {
        console.error(`❌ Error processing complaint ${complaint._id}:`, complaintError.message);
        
        // Reset status back to pending_verification on error
        try {
          complaint.status = "pending_verification";
          await complaint.save();
        } catch (resetError) {
          console.error(`❌ Failed to reset complaint ${complaint._id} status:`, resetError.message);
        }
      }
    }
  } catch (error) {
    console.error("❌ Cron job error:", error.message);
  }
}, {
  scheduled: false, // Don't start immediately
  timezone: "UTC" // Use UTC timezone
});

// Start the cron job
cronJob.start();
console.log("🚀 Complaint verification cron job started (runs every 5 minutes)");

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Stopping cron job...');
  cronJob.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Stopping cron job...');
  cronJob.stop();
  process.exit(0);
});

export default cronJob;
