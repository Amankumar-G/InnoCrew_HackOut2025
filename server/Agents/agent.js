import { START, StateGraph, END } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { imageAnalysisPrompt, geoValidationPrompt, nlpTextPrompt, aggregatorPrompt } from "./prompt.js";
import { io } from '../config/socket.js';

// Initialize specialized LLM instances for different verification tasks
const imageAnalysisLLM = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.1 });
const geoValidationLLM = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.1 });
const nlpTextLLM = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.1 });
const aggregatorLLM = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.2 });

/**
 * Image Analysis Agent - Detect mangrove cutting/dumping/fire evidence
 * Input: { media: Array<{type: 'photo'|'video', url: string, metadata: object}> }
 * Output: { imageCheck: boolean, confidence: number, detectedIssues: string[], analysisDetails: string }
 */
async function imageAnalysisAgent(state) {
  console.log("\n=== IMAGE ANALYSIS AGENT STARTED ===");
  io.emit("message", "\n=== IMAGE ANALYSIS AGENT STARTED ===");
  
  try {
    const prompt = imageAnalysisPrompt;
    const chain = prompt.pipe(imageAnalysisLLM);
    const response = await chain.invoke({
      media: state.media,
      complaint_category: state.complaint_category
    });
    
    const analysis = JSON.parse(response.content
      .replace(/^json\s*/i, '')
      .replace(/```/g, '')
      .trim());
    
    console.log("Image Analysis Result:", analysis);
    io.emit("image-analysis", analysis);
    
    return { 
      imageAnalysis: analysis,
      imageCheck: analysis.imageCheck,
      imageConfidence: analysis.confidence
    };
  } catch (error) {
    console.error("Image Analysis Error:", error);
    return { 
      imageAnalysis: { imageCheck: false, confidence: 0, error: error.message },
      imageCheck: false,
      imageConfidence: 0
    };
  }
}

/**
 * Geo-Validation Agent - Validate location and detect recent changes
 * Input: { location: {lat: number, lng: number, address: string}, complaint_date: string }
 * Output: { geoCheck: boolean, isInMangroveZone: boolean, recentChangesDetected: boolean, geoDetails: string }
 */
async function geoValidationAgent(state) {
  console.log("\n=== GEO-VALIDATION AGENT STARTED ===");
  io.emit("message", "\n=== GEO-VALIDATION AGENT STARTED ===");
  
  try {
    const prompt = geoValidationPrompt;
    const chain = prompt.pipe(geoValidationLLM);
    const response = await chain.invoke({
      location: state.location,
      complaint_date: state.complaint_date,
      complaint_category: state.complaint_category
    });
    
    const geoValidation = JSON.parse(response.content
      .replace(/^json\s*/i, '')
      .replace(/```/g, '')
      .trim());
    
    console.log("Geo-Validation Result:", geoValidation);
    io.emit("geo-validation", geoValidation);
    
    return { 
      geoValidation: geoValidation,
      geoCheck: geoValidation.geoCheck,
      isInMangroveZone: geoValidation.isInMangroveZone
    };
  } catch (error) {
    console.error("Geo-Validation Error:", error);
    return { 
      geoValidation: { geoCheck: false, isInMangroveZone: false, error: error.message },
      geoCheck: false,
      isInMangroveZone: false
    };
  }
}

/**
 * NLP/Text Agent - Analyze complaint text for validity and severity
 * Input: { description: string, complaint_category: string }
 * Output: { textCheck: boolean, preliminarySeverity: number, severityKeywords: string[], textAnalysis: string }
 */
async function nlpTextAgent(state) {
  console.log("\n=== NLP/TEXT AGENT STARTED ===");
  io.emit("message", "\n=== NLP/TEXT AGENT STARTED ===");
  
  try {
    const prompt = nlpTextPrompt;
    const chain = prompt.pipe(nlpTextLLM);
    const response = await chain.invoke({
      description: state.description,
      complaint_category: state.complaint_category
    });
    
    const textAnalysis = JSON.parse(response.content
      .replace(/^json\s*/i, '')
      .replace(/```/g, '')
      .trim());
    
    console.log("NLP/Text Analysis Result:", textAnalysis);
    io.emit("text-analysis", textAnalysis);
    
    return { 
      textAnalysis: textAnalysis,
      textCheck: textAnalysis.textCheck,
      preliminarySeverity: textAnalysis.preliminarySeverity
    };
  } catch (error) {
    console.error("NLP/Text Analysis Error:", error);
    return { 
      textAnalysis: { textCheck: false, preliminarySeverity: 0, error: error.message },
      textCheck: false,
      preliminarySeverity: 0
    };
  }
}

/**
 * Aggregator Agent - Combine all agent results and make final decision
 * Input: All previous agent results
 * Output: { finalVerification: object, complaintStatus: 'verified'|'rejected', finalSeverity: 'low'|'medium'|'high' }
 */
async function aggregatorAgent(state) {
  console.log("\n=== AGGREGATOR AGENT STARTED ===");
  io.emit("message", "\n=== AGGREGATOR AGENT STARTED ===");
  
  try {
    const prompt = aggregatorPrompt;
    const chain = prompt.pipe(aggregatorLLM);
    const response = await chain.invoke({
      imageAnalysis: state.imageAnalysis,
      geoValidation: state.geoValidation,
      textAnalysis: state.textAnalysis,
      imageCheck: state.imageCheck,
      geoCheck: state.geoCheck,
      textCheck: state.textCheck,
      imageConfidence: state.imageConfidence,
      preliminarySeverity: state.preliminarySeverity,
      complaint_category: state.complaint_category
    });
    
    const finalResult = JSON.parse(response.content
      .replace(/^json\s*/i, '')
      .replace(/```/g, '')
      .trim());
    
    console.log("Final Verification Result:", finalResult);
    io.emit("final-verification", finalResult);
    
    return { 
      finalVerification: finalResult,
      complaintStatus: finalResult.complaintStatus,
      finalSeverity: finalResult.finalSeverity,
      verificationComplete: true
    };
  } catch (error) {
    console.error("Aggregator Error:", error);
    return { 
      finalVerification: { complaintStatus: 'rejected', error: error.message },
      complaintStatus: 'rejected',
      finalSeverity: 'low',
      verificationComplete: true
    };
  }
}

/**
 * Main verification workflow function
 * @param {Object} complaintData - The complaint data to verify
 * @param {Array} complaintData.media - Array of media files (photos/videos)
 * @param {Object} complaintData.location - Location data {lat, lng, address}
 * @param {string} complaintData.description - Complaint description text
 * @param {string} complaintData.complaint_category - Category of complaint
 * @param {string} complaintData.complaint_date - Date of complaint
 * @returns {Object} Final verification state
 */
async function runMangroveVerification(complaintData) {
  const { media, location, description, complaint_category, complaint_date } = complaintData;
  
  const workflow = new StateGraph({
    channels: {
      // Input channels
      media: { default: () => media, aggregate: "last" },
      location: { default: () => location, aggregate: "last" },
      description: { default: () => description, aggregate: "last" },
      complaint_category: { default: () => complaint_category, aggregate: "last" },
      complaint_date: { default: () => complaint_date, aggregate: "last" },
      
      // Agent result channels
      imageAnalysis: { default: () => null, aggregate: "last" },
      geoValidation: { default: () => null, aggregate: "last" },
      textAnalysis: { default: () => null, aggregate: "last" },
      
      // Check result channels
      imageCheck: { default: () => false, aggregate: "last" },
      geoCheck: { default: () => false, aggregate: "last" },
      textCheck: { default: () => false, aggregate: "last" },
      
      // Confidence and severity channels
      imageConfidence: { default: () => 0, aggregate: "last" },
      preliminarySeverity: { default: () => 0, aggregate: "last" },
      
      // Final result channels
      finalVerification: { default: () => null, aggregate: "last" },
      complaintStatus: { default: () => 'pending', aggregate: "last" },
      finalSeverity: { default: () => 'low', aggregate: "last" },
      verificationComplete: { default: () => false, aggregate: "last" },
      
      // Additional tracking
      isInMangroveZone: { default: () => false, aggregate: "last" }
    },
  });

  // Add all agent nodes
  workflow.addNode("imageAnalysis", imageAnalysisAgent);
  workflow.addNode("geoValidation", geoValidationAgent);
  workflow.addNode("nlpText", nlpTextAgent);
  workflow.addNode("aggregator", aggregatorAgent);

  // Define the workflow edges - agents run in parallel then aggregate
  workflow.addEdge(START, "imageAnalysis");
  workflow.addEdge(START, "geoValidation");
  workflow.addEdge(START, "nlpText");
  
  // All three agents feed into the aggregator
  workflow.addEdge("imageAnalysis", "aggregator");
  workflow.addEdge("geoValidation", "aggregator");
  workflow.addEdge("nlpText", "aggregator");
  
  // Aggregator is the final step
  workflow.addEdge("aggregator", END);

  console.log("Starting Mangrove Complaint Verification Workflow...");
  io.emit("workflow-start", { complaint_category, location: location.address });

  const app = workflow.compile();
  const finalState = await app.invoke({
    media,
    location,
    description,
    complaint_category,
    complaint_date,
  });
  
  console.log("Verification Workflow Completed");
  io.emit("workflow-complete", {
    status: finalState.complaintStatus,
    severity: finalState.finalSeverity,
    verification: finalState.finalVerification
  });
  
  return finalState;
}

/**
 * Utility function to create a verification summary
 * @param {Object} verificationState - Final state from verification workflow
 * @returns {Object} Formatted verification summary
 */
function createVerificationSummary(verificationState) {
  return {
    complaintId: verificationState.complaintId || Date.now().toString(),
    timestamp: new Date().toISOString(),
    status: verificationState.complaintStatus,
    severity: verificationState.finalSeverity,
    checks: {
      image: {
        passed: verificationState.imageCheck,
        confidence: verificationState.imageConfidence,
        details: verificationState.imageAnalysis
      },
      geo: {
        passed: verificationState.geoCheck,
        inMangroveZone: verificationState.isInMangroveZone,
        details: verificationState.geoValidation
      },
      text: {
        passed: verificationState.textCheck,
        preliminarySeverity: verificationState.preliminarySeverity,
        details: verificationState.textAnalysis
      }
    },
    finalVerification: verificationState.finalVerification,
    verificationComplete: verificationState.verificationComplete
  };
}

export { runMangroveVerification, createVerificationSummary };