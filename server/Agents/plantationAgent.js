// Agents/plantationAgent.js
import { START, StateGraph, END } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { 
  dataValidationPrompt, 
  imageVerificationPrompt, 
  documentVerificationPrompt, 
  locationVerificationPrompt,
  plantationAggregatorPrompt 
} from "./plantationPrompts.js";
import { io } from '../config/socket.js';

// Initialize specialized LLM instances for different verification tasks
const dataValidationLLM = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.1 });
const imageVerificationLLM = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.1 });
const documentVerificationLLM = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.1 });
const locationVerificationLLM = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.1 });
const aggregatorLLM = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.2 });

/**
 * Data Validation Agent - Validate plantation data consistency and constraints
 */
async function dataValidationAgent(state) {
  console.log("\n=== DATA VALIDATION AGENT STARTED ===");
  io.emit("message", "\n=== DATA VALIDATION AGENT STARTED ===");
  
  try {
    const prompt = dataValidationPrompt;
    const chain = prompt.pipe(dataValidationLLM);
    const response = await chain.invoke({
      plantationName: state.plantationName,
      area: state.area,
      species: state.species,
      plantingDate: state.plantingDate,
      survivalRate: state.survivalRate,
      expectedCarbonCredit: state.expectedCarbonCredit,
      submissionDate: state.submissionDate
    });
    
    const analysis = JSON.parse(response.content
      .replace(/^json\s*/i, '')
      .replace(/```/g, '')
      .trim());
    
    console.log("Data Validation Result:", analysis);
    io.emit("data-validation", analysis);
    
    return { 
      dataAnalysis: analysis,
      dataCheck: analysis.dataCheck,
      dataConfidence: analysis.confidence,
      dataScore: analysis.score
    };
  } catch (error) {
    console.error("Data Validation Error:", error);
    return { 
      dataAnalysis: { dataCheck: false, confidence: 0, score: 0, error: error.message },
      dataCheck: false,
      dataConfidence: 0,
      dataScore: 0
    };
  }
}

/**
 * Image Verification Agent - Analyze plantation images for authenticity
 */
async function imageVerificationAgent(state) {
  console.log("\n=== IMAGE VERIFICATION AGENT STARTED ===");
  io.emit("message", "\n=== IMAGE VERIFICATION AGENT STARTED ===");
  
  try {
    const prompt = imageVerificationPrompt;
    const chain = prompt.pipe(imageVerificationLLM);
    const response = await chain.invoke({
      images: state.images,
      plantationName: state.plantationName,
      species: state.species,
      area: state.area,
      plantingDate: state.plantingDate
    });
    
    const analysis = JSON.parse(response.content
      .replace(/^json\s*/i, '')
      .replace(/```/g, '')
      .trim());
    
    console.log("Image Verification Result:", analysis);
    io.emit("image-verification", analysis);
    
    return { 
      imageAnalysis: analysis,
      imageCheck: analysis.imageCheck,
      imageConfidence: analysis.confidence,
      imageScore: analysis.score,
      vegetationDetected: analysis.vegetationDetected
    };
  } catch (error) {
    console.error("Image Verification Error:", error);
    return { 
      imageAnalysis: { imageCheck: false, confidence: 0, score: 0, error: error.message },
      imageCheck: false,
      imageConfidence: 0,
      imageScore: 0,
      vegetationDetected: false
    };
  }
}

/**
 * Document Verification Agent - Validate certificates and supporting documents
 */
async function documentVerificationAgent(state) {
  console.log("\n=== DOCUMENT VERIFICATION AGENT STARTED ===");
  io.emit("message", "\n=== DOCUMENT VERIFICATION AGENT STARTED ===");
  
  try {
    const prompt = documentVerificationPrompt;
    const chain = prompt.pipe(documentVerificationLLM);
    const response = await chain.invoke({
      soilCertificate: state.soilCertificate,
      plantCertificate: state.plantCertificate,
      additionalDocs: state.additionalDocs,
      plantingDate: state.plantingDate,
      species: state.species,
      location: state.location
    });
    
    const analysis = JSON.parse(response.content
      .replace(/^json\s*/i, '')
      .replace(/```/g, '')
      .trim());
    
    console.log("Document Verification Result:", analysis);
    io.emit("document-verification", analysis);
    
    return { 
      documentAnalysis: analysis,
      documentCheck: analysis.documentCheck,
      documentConfidence: analysis.confidence,
      documentScore: analysis.score,
      certificatesValid: analysis.certificatesValid
    };
  } catch (error) {
    console.error("Document Verification Error:", error);
    return { 
      documentAnalysis: { documentCheck: false, confidence: 0, score: 0, error: error.message },
      documentCheck: false,
      documentConfidence: 0,
      documentScore: 0,
      certificatesValid: false
    };
  }
}

/**
 * Location Verification Agent - Validate geographic data and suitability
 */
async function locationVerificationAgent(state) {
  console.log("\n=== LOCATION VERIFICATION AGENT STARTED ===");
  io.emit("message", "\n=== LOCATION VERIFICATION AGENT STARTED ===");
  
  try {
    const prompt = locationVerificationPrompt;
    const chain = prompt.pipe(locationVerificationLLM);
    const response = await chain.invoke({
      location: state.location,
      species: state.species,
      area: state.area,
      plantingDate: state.plantingDate,
      plantationName: state.plantationName
    });
    
    const analysis = JSON.parse(response.content
      .replace(/^json\s*/i, '')
      .replace(/```/g, '')
      .trim());
    
    console.log("Location Verification Result:", analysis);
    io.emit("location-verification", analysis);
    
    return { 
      locationAnalysis: analysis,
      locationCheck: analysis.locationCheck,
      locationConfidence: analysis.confidence,
      locationScore: analysis.score,
      suitableForSpecies: analysis.suitableForSpecies,
      mangroveRegion: analysis.mangroveRegion
    };
  } catch (error) {
    console.error("Location Verification Error:", error);
    return { 
      locationAnalysis: { locationCheck: false, confidence: 0, score: 0, error: error.message },
      locationCheck: false,
      locationConfidence: 0,
      locationScore: 0,
      suitableForSpecies: false,
      mangroveRegion: false
    };
  }
}

/**
 * Aggregator Agent - Combine all agent results and make final decision
 */
async function aggregatorAgent(state) {
  console.log("\n=== PLANTATION AGGREGATOR AGENT STARTED ===");
  io.emit("message", "\n=== PLANTATION AGGREGATOR AGENT STARTED ===");
  
  try {
    const prompt = plantationAggregatorPrompt;
    const chain = prompt.pipe(aggregatorLLM);
    const response = await chain.invoke({
      dataAnalysis: state.dataAnalysis,
      imageAnalysis: state.imageAnalysis,
      documentAnalysis: state.documentAnalysis,
      locationAnalysis: state.locationAnalysis,
      
      // Individual check results
      dataCheck: state.dataCheck,
      imageCheck: state.imageCheck,
      documentCheck: state.documentCheck,
      locationCheck: state.locationCheck,
      
      // Confidence scores
      dataConfidence: state.dataConfidence,
      imageConfidence: state.imageConfidence,
      documentConfidence: state.documentConfidence,
      locationConfidence: state.locationConfidence,
      
      // Individual scores
      dataScore: state.dataScore,
      imageScore: state.imageScore,
      documentScore: state.documentScore,
      locationScore: state.locationScore,
      
      // Additional context
      plantationName: state.plantationName,
      area: state.area,
      species: state.species,
      survivalRate: state.survivalRate
    });
    
    const finalResult = JSON.parse(response.content
      .replace(/^json\s*/i, '')
      .replace(/```/g, '')
      .trim());

    // Ensure required fields are set
    finalResult.carbonCreditGenerated = finalResult.carbonCreditGenerated || 0;
    finalResult.severityFlags = finalResult.severityFlags || [];
    
    console.log("Final Plantation Verification Result:", finalResult);
    io.emit("final-plantation-verification", finalResult);
    
    return { 
      aggregatedResult: finalResult,
      finalStatus: finalResult.finalStatus,
      overallScore: finalResult.overallScore,
      aggregatedConfidence: finalResult.aggregatedConfidence,
      verificationComplete: true,
      carbonCreditGenerated: finalResult.carbonCreditGenerated,
      severityFlags: finalResult.severityFlags,
      verificationSummary: finalResult.verificationSummary
    };
  } catch (error) {
    console.error("Plantation Aggregator Error:", error);
    return { 
      aggregatedResult: { 
        finalStatus: 'rejected', 
        overallScore: 0,
        error: error.message, 
        carbonCreditGenerated: 0,
        severityFlags: ["system_error"]
      },
      finalStatus: 'rejected',
      overallScore: 0,
      aggregatedConfidence: 0,
      verificationComplete: true,
      carbonCreditGenerated: 0,
      severityFlags: ["system_error"]
    };
  }
}

/**
 * Main plantation verification workflow function
 */
async function runPlantationVerification(plantationData) {
  const { 
    plantationId, plantationName, projectOwnerId, location, area, species, 
    plantingDate, survivalRate, expectedCarbonCredit, images, soilCertificate, 
    plantCertificate, additionalDocs, submissionDate, currentStatus 
  } = plantationData;
  
  const workflow = new StateGraph({
    channels: {
      // Input data
      plantationId: { default: () => plantationId, aggregate: "last" },
      plantationName: { default: () => plantationName, aggregate: "last" },
      projectOwnerId: { default: () => projectOwnerId, aggregate: "last" },
      location: { default: () => location, aggregate: "last" },
      area: { default: () => area, aggregate: "last" },
      species: { default: () => species, aggregate: "last" },
      plantingDate: { default: () => plantingDate, aggregate: "last" },
      survivalRate: { default: () => survivalRate, aggregate: "last" },
      expectedCarbonCredit: { default: () => expectedCarbonCredit, aggregate: "last" },
      images: { default: () => images, aggregate: "last" },
      soilCertificate: { default: () => soilCertificate, aggregate: "last" },
      plantCertificate: { default: () => plantCertificate, aggregate: "last" },
      additionalDocs: { default: () => additionalDocs, aggregate: "last" },
      submissionDate: { default: () => submissionDate, aggregate: "last" },
      currentStatus: { default: () => currentStatus, aggregate: "last" },
      
      // Agent results
      dataAnalysis: { default: () => null, aggregate: "last" },
      imageAnalysis: { default: () => null, aggregate: "last" },
      documentAnalysis: { default: () => null, aggregate: "last" },
      locationAnalysis: { default: () => null, aggregate: "last" },
      
      // Check results
      dataCheck: { default: () => false, aggregate: "last" },
      imageCheck: { default: () => false, aggregate: "last" },
      documentCheck: { default: () => false, aggregate: "last" },
      locationCheck: { default: () => false, aggregate: "last" },
      
      // Confidence scores
      dataConfidence: { default: () => 0, aggregate: "last" },
      imageConfidence: { default: () => 0, aggregate: "last" },
      documentConfidence: { default: () => 0, aggregate: "last" },
      locationConfidence: { default: () => 0, aggregate: "last" },
      
      // Individual scores
      dataScore: { default: () => 0, aggregate: "last" },
      imageScore: { default: () => 0, aggregate: "last" },
      documentScore: { default: () => 0, aggregate: "last" },
      locationScore: { default: () => 0, aggregate: "last" },
      
      // Additional flags
      vegetationDetected: { default: () => false, aggregate: "last" },
      certificatesValid: { default: () => false, aggregate: "last" },
      suitableForSpecies: { default: () => false, aggregate: "last" },
      mangroveRegion: { default: () => false, aggregate: "last" },
      
      // Final results
      aggregatedResult: { default: () => null, aggregate: "last" },
      finalStatus: { default: () => 'pending', aggregate: "last" },
      overallScore: { default: () => 0, aggregate: "last" },
      aggregatedConfidence: { default: () => 0, aggregate: "last" },
      verificationComplete: { default: () => false, aggregate: "last" },
      carbonCreditGenerated: { default: () => 0, aggregate: "last" },
      severityFlags: { default: () => [], aggregate: "last" }
    },
  });

  // Add agent nodes
  workflow.addNode("dataAgent", dataValidationAgent);
  workflow.addNode("imageAgent", imageVerificationAgent);
  workflow.addNode("documentAgent", documentVerificationAgent);
  workflow.addNode("locationAgent", locationVerificationAgent);
  workflow.addNode("aggregatorAgent", aggregatorAgent);

  // Parallel execution from START
  workflow.addEdge(START, "dataAgent");
  workflow.addEdge(START, "imageAgent");
  workflow.addEdge(START, "documentAgent");
  workflow.addEdge(START, "locationAgent");

  // All agents feed into aggregator
  workflow.addEdge("dataAgent", "aggregatorAgent");
  workflow.addEdge("imageAgent", "aggregatorAgent");
  workflow.addEdge("documentAgent", "aggregatorAgent");
  workflow.addEdge("locationAgent", "aggregatorAgent");

  // Final step
  workflow.addEdge("aggregatorAgent", END);

  console.log("Starting Plantation Verification Workflow...");
  io.emit("plantation-workflow-start", { 
    plantationId, 
    plantationName, 
    location: location?.address || "unknown" 
  });

  const app = workflow.compile();
  const finalState = await app.invoke({
    plantationId,
    plantationName,
    projectOwnerId,
    location,
    area,
    species,
    plantingDate,
    survivalRate,
    expectedCarbonCredit,
    images,
    soilCertificate,
    plantCertificate,
    additionalDocs,
    submissionDate,
    currentStatus
  });
  
  console.log("Plantation Verification Workflow Completed");
  io.emit("plantation-workflow-complete", {
    plantationId: finalState.plantationId,
    status: finalState.finalStatus,
    score: finalState.overallScore,
    verification: finalState.aggregatedResult,
    carbonCreditGenerated: finalState.carbonCreditGenerated
  });
  
  return finalState;
}

/**
 * Utility function to create a plantation verification summary
 */
function createPlantationVerificationSummary(verificationState) {
  return {
    plantationId: verificationState.plantationId || Date.now().toString(),
    timestamp: new Date().toISOString(),
    finalStatus: verificationState.finalStatus,
    overallScore: verificationState.overallScore,
    carbonCreditGenerated: verificationState.carbonCreditGenerated || 0,
    
    agentResults: {
      dataValidation: {
        passed: verificationState.dataCheck,
        confidence: verificationState.dataConfidence,
        score: verificationState.dataScore,
        details: verificationState.dataAnalysis
      },
      imageVerification: {
        passed: verificationState.imageCheck,
        confidence: verificationState.imageConfidence,
        score: verificationState.imageScore,
        vegetationDetected: verificationState.vegetationDetected,
        details: verificationState.imageAnalysis
      },
      documentVerification: {
        passed: verificationState.documentCheck,
        confidence: verificationState.documentConfidence,
        score: verificationState.documentScore,
        certificatesValid: verificationState.certificatesValid,
        details: verificationState.documentAnalysis
      },
      locationVerification: {
        passed: verificationState.locationCheck,
        confidence: verificationState.locationConfidence,
        score: verificationState.locationScore,
        suitableForSpecies: verificationState.suitableForSpecies,
        mangroveRegion: verificationState.mangroveRegion,
        details: verificationState.locationAnalysis
      }
    },
    
    aggregatedResult: verificationState.aggregatedResult,
    severityFlags: verificationState.severityFlags || [],
    verificationComplete: verificationState.verificationComplete,
    
    // Summary metrics
    totalChecks: 4,
    passedChecks: [
      verificationState.dataCheck,
      verificationState.imageCheck,
      verificationState.documentCheck,
      verificationState.locationCheck
    ].filter(Boolean).length,
    
    aggregatedConfidence: verificationState.aggregatedConfidence || 0
  };
}

export { runPlantationVerification, createPlantationVerificationSummary };