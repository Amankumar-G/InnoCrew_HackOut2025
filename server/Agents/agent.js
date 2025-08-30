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

    // Ensure carbonCreditsEarned is set (default 0)
    finalResult.carbonCreditsEarned = finalResult.carbonCreditsEarned || 0;
    
    console.log("Final Verification Result:", finalResult);
    io.emit("final-verification", finalResult);
    
    return { 
      finalVerification: finalResult,
      complaintStatus: finalResult.complaintStatus,
      finalSeverity: finalResult.finalSeverity,
      verificationComplete: true,
      carbonCreditsEarned: finalResult.carbonCreditsEarned
    };
  } catch (error) {
    console.error("Aggregator Error:", error);
    return { 
      finalVerification: { complaintStatus: 'rejected', error: error.message, carbonCreditsEarned: 0 },
      complaintStatus: 'rejected',
      finalSeverity: 'low',
      verificationComplete: true,
      carbonCreditsEarned: 0
    };
  }
}
/**
 * Main verification workflow function
 */
async function runMangroveVerification(complaintData) {
  const { media, location, description, complaint_category, complaint_date } = complaintData;
  
  const workflow = new StateGraph({
    channels: {
      media: { default: () => media, aggregate: "last" },
      location: { default: () => location, aggregate: "last" },
      description: { default: () => description, aggregate: "last" },
      complaint_category: { default: () => complaint_category, aggregate: "last" },
      complaint_date: { default: () => complaint_date, aggregate: "last" },
      
      imageAnalysis: { default: () => null, aggregate: "last" },
      geoValidation: { default: () => null, aggregate: "last" },
      textAnalysis: { default: () => null, aggregate: "last" },
      
      imageCheck: { default: () => false, aggregate: "last" },
      geoCheck: { default: () => false, aggregate: "last" },
      textCheck: { default: () => false, aggregate: "last" },
      
      imageConfidence: { default: () => 0, aggregate: "last" },
      preliminarySeverity: { default: () => 0, aggregate: "last" },
      
      finalVerification: { default: () => null, aggregate: "last" },
      complaintStatus: { default: () => 'pending', aggregate: "last" },
      finalSeverity: { default: () => 'low', aggregate: "last" },
      verificationComplete: { default: () => false, aggregate: "last" },
      
      isInMangroveZone: { default: () => false, aggregate: "last" },
      carbonCreditsEarned: { default: () => 0, aggregate: "last" } // new channel
    },
  });

  workflow.addNode("imageAgent", imageAnalysisAgent);
  workflow.addNode("geoAgent", geoValidationAgent);
  workflow.addNode("textAgent", nlpTextAgent);
  workflow.addNode("aggregatorAgent", aggregatorAgent);

  workflow.addEdge(START, "imageAgent");
  workflow.addEdge(START, "geoAgent");
  workflow.addEdge(START, "textAgent");

  workflow.addEdge("imageAgent", "aggregatorAgent");
  workflow.addEdge("geoAgent", "aggregatorAgent");
  workflow.addEdge("textAgent", "aggregatorAgent");

  workflow.addEdge("aggregatorAgent", END);

  console.log("Starting Mangrove Complaint Verification Workflow...");
  io.emit("workflow-start", { complaint_category, location: location?.address || "unknown" });

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
    verification: finalState.finalVerification,
    carbonCreditsEarned: finalState.carbonCreditsEarned
  });
  
  return finalState;
}

/**
 * Utility function to create a verification summary
 */
function createVerificationSummary(verificationState) {
  return {
    complaintId: verificationState.complaintId || Date.now().toString(),
    timestamp: new Date().toISOString(),
    status: verificationState.complaintStatus,
    severity: verificationState.finalSeverity,
    carbonCreditsEarned: verificationState.carbonCreditsEarned || 0, // new field
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