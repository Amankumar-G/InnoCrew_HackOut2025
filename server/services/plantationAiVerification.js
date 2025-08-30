// services/plantationAiVerification.js
import { runPlantationVerification, createPlantationVerificationSummary } from '../Agents/plantationAgent.js';

export async function runPlantationVerificationWorkflow(plantation) {
  try {
    console.log("=== Plantation Verification Workflow Started ===");
    console.log("Incoming plantation:", plantation);

    // Transform plantation data to match workflow input format
    const plantationData = {
      plantationId: plantation._id,
      plantationName: plantation.plantationName,
      projectOwnerId: plantation.projectOwnerId,
      
      // Location data
      location: {
        latitude: plantation.location?.latitude,
        longitude: plantation.location?.longitude,
        address: plantation.location?.address
      },
      
      // Plantation details
      area: plantation.area,
      species: plantation.species,
      plantingDate: plantation.plantingDate,
      survivalRate: plantation.survivalRate,
      expectedCarbonCredit: plantation.expectedCarbonCredit,
      
      // Evidence files
      images: plantation.images || [],
      soilCertificate: plantation.soilCertificate,
      plantCertificate: plantation.plantCertificate,
      additionalDocs: plantation.additionalDocs || [],
      
      // Metadata
      submissionDate: plantation.createdAt || new Date().toISOString(),
      currentStatus: plantation.status
    };

    console.log("Transformed plantationData:", plantationData);

    // Run the multi-agent verification workflow
    const verificationState = await runPlantationVerification(plantationData);
    console.log("Verification state from workflow:", verificationState);

    // Create verification summary
    const summary = createPlantationVerificationSummary(verificationState);
    console.log("Generated verification summary:", summary);

    // Calculate carbon credits based on area, species, and survival rate
    const calculatedCarbonCredits = calculateCarbonCredits(
      plantation.area,
      plantation.species,
      plantation.survivalRate,
      verificationState.overallScore
    );

    // Final return object
    const result = {
      verified: verificationState.finalStatus === 'verified_by_ai',
      data: {
        dataValidation: verificationState.dataCheck,
        imageValidation: verificationState.imageCheck,
        documentValidation: verificationState.documentCheck,
        locationValidation: verificationState.locationCheck,
        overallScore: verificationState.overallScore,
        carbonCreditGenerated: calculatedCarbonCredits,
        confidenceScore: verificationState.aggregatedConfidence || 0,
        severityFlags: verificationState.severityFlags || [],
        summary: `Plantation verification completed with overall score: ${verificationState.overallScore}/100. ${verificationState.verificationComplete ? 'All agents completed successfully.' : 'Some agents failed to complete.'}`,
        verificationSummary: summary,
        fullAnalysis: {
          dataAnalysis: verificationState.dataAnalysis,
          imageAnalysis: verificationState.imageAnalysis,
          documentAnalysis: verificationState.documentAnalysis,
          locationAnalysis: verificationState.locationAnalysis,
          aggregatedResult: verificationState.aggregatedResult
        }
      }
    };

    console.log("=== Final Plantation Verification Result ===");
    console.log(result);

    return result;
  } catch (error) {
    console.error("Plantation Verification Workflow Error:", error);

    // Fallback response in case of error
    const fallback = {
      verified: false,
      data: {
        dataValidation: false,
        imageValidation: false,
        documentValidation: false,
        locationValidation: false,
        overallScore: 0,
        carbonCreditGenerated: 0,
        confidenceScore: 0,
        severityFlags: ["system_error"],
        summary: `Verification failed due to system error: ${error.message}`,
        error: error.message
      }
    };

    console.log("Returning fallback result:", fallback);
    return fallback;
  }
}

/**
 * Calculate carbon credits based on plantation parameters
 */
function calculateCarbonCredits(area, species, survivalRate, verificationScore) {
  if (!area || !survivalRate || verificationScore < 60) {
    return 0;
  }

  // Base carbon sequestration per hectare per year for mangrove species
  const speciesMultipliers = {
    'avicennia': 1.2,
    'rhizophora': 1.5,
    'sonneratia': 1.1,
    'bruguiera': 1.3,
    'ceriops': 1.0,
    'heritiera': 1.4,
    'phoenix': 0.8,
    'oak': 0.7,
    'pine': 0.6,
    'birch': 0.5
  };

  // Calculate average multiplier for species mix
  let totalMultiplier = 0;
  let validSpeciesCount = 0;

  species.forEach(speciesName => {
    const normalizedName = speciesName.toLowerCase().trim();
    const multiplier = speciesMultipliers[normalizedName] || 0.8; // Default for unknown species
    totalMultiplier += multiplier;
    validSpeciesCount++;
  });

  const avgMultiplier = validSpeciesCount > 0 ? totalMultiplier / validSpeciesCount : 0.8;

  // Base calculation: area * survival rate * species multiplier * verification confidence
  const baseCredits = area * (survivalRate / 100) * avgMultiplier;
  const verificationMultiplier = verificationScore / 100;
  
  // Final carbon credits (tons CO2 per year)
  const carbonCredits = baseCredits * verificationMultiplier;

  return Math.round(carbonCredits * 100) / 100; // Round to 2 decimal places
}