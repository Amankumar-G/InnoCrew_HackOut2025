// services/aiVerification.js
import { runMangroveVerification, createVerificationSummary } from '../Agents/agent.js';

export async function runVerificationWorkflow(complaint) {
  try {
    console.log("=== Verification Workflow Started ===");
    console.log("Incoming complaint:", complaint);

    // Transform complaint data to match workflow input format
    const complaintData = {
      media: complaint.media || [],
      location: {
        lat: complaint.latitude,
        lng: complaint.longitude,
        address: complaint.location
      },
      description: complaint.description,
      complaint_category: complaint.category,
      complaint_date: complaint.createdAt || new Date().toISOString()
    };
    console.log("Transformed complaintData:", complaintData);

    // Run the multi-agent verification workflow
    const verificationState = await runMangroveVerification(complaintData);
    console.log("Verification state from workflow:", verificationState);

    // Create verification summary
    const summary = createVerificationSummary(verificationState);
    console.log("Generated verification summary:", summary);

    // Final return object
    const result = {
      verified: verificationState.complaintStatus === 'verified',
      data: {
        imageCheck: verificationState.imageCheck,
        geoCheck: verificationState.geoCheck,
        textCheck: verificationState.textCheck,
        severity: verificationState.finalSeverity,
        confidenceScore: verificationState.imageConfidence,
        verificationSummary: summary,
        fullAnalysis: {
          imageAnalysis: verificationState.imageAnalysis,
          geoValidation: verificationState.geoValidation,
          textAnalysis: verificationState.textAnalysis,
          finalVerification: verificationState.finalVerification
        }
      }
    };

    console.log("=== Final Verification Result ===");
    console.log(result);

    return result;
  } catch (error) {
    console.error("Verification Workflow Error:", error);

    // Fallback response in case of error
    const fallback = {
      verified: false,
      data: {
        imageCheck: false,
        geoCheck: false,
        textCheck: false,
        severity: "low",
        confidenceScore: 0,
        error: error.message
      }
    };

    console.log("Returning fallback result:", fallback);
    return fallback;
  }
}
