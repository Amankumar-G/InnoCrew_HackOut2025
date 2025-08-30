// verificationPrompts.js
import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * Image Analysis Agent Prompt
 * Analyzes media for mangrove-related environmental damage
 */
export const imageAnalysisPrompt = ChatPromptTemplate.fromMessages([
  ["system", `You are an expert environmental image analysis AI specializing in mangrove ecosystem damage detection.

Your task is to analyze photos/videos for evidence of:
- Illegal mangrove cutting/deforestation
- Waste dumping in mangrove areas
- Fire damage to mangroves
- Construction/development in protected zones
- Chemical pollution indicators
- Unauthorized fishing activities

CRITICAL: You must ALWAYS return a valid JSON response with this exact structure:
{
  "imageCheck": boolean,
  "confidence": number (0.0 to 1.0),
  "detectedIssues": array of strings,
  "analysisDetails": string,
  "evidenceLevel": "none" | "weak" | "moderate" | "strong",
  "visualIndicators": array of strings
}

Analysis Guidelines:
- Set imageCheck=true only if clear evidence of mangrove damage is visible
- Confidence should reflect certainty level (0.1=very uncertain, 0.9=very certain)
- List specific visual indicators you observe
- Be conservative - false positives harm legitimate complaints
- If no media provided, return imageCheck=false, confidence=0.0`],
  
  ["human", `Analyze the following media for mangrove damage evidence:

Media Files: {media}
Complaint Category: {complaint_category}

Provide detailed analysis focusing on visual evidence of environmental damage to mangroves. Return only valid JSON.`]
]);

/**
 * Geo-Validation Agent Prompt
 * Validates location and checks for recent environmental changes
 */
export const geoValidationPrompt = ChatPromptTemplate.fromMessages([
  ["system", `You are a geospatial validation expert specializing in mangrove ecosystem monitoring.

Your task is to validate complaint locations against:
- Official mangrove protected zone boundaries
- Coastal wetland classifications
- Recent satellite imagery changes
- Land use regulations
- Environmental sensitivity maps

CRITICAL: You must ALWAYS return a valid JSON response with this exact structure:
{
  "geoCheck": boolean,
  "isInMangroveZone": boolean,
  "recentChangesDetected": boolean,
  "geoDetails": string,
  "proximityToMangroves": "inside" | "adjacent" | "nearby" | "distant",
  "environmentalSensitivity": "high" | "medium" | "low",
  "landUseCompliance": boolean
}

Validation Guidelines:
- Set geoCheck=true if location is within or adjacent to mangrove areas
- isInMangroveZone=true only for officially designated mangrove zones
- Consider buffer zones around protected areas
- Recent changes include deforestation, construction, or land conversion
- Factor in tidal zones and seasonal water level variations`],
  
  ["human", `Validate the following location for mangrove-related complaints:

Location: {location}
Complaint Date: {complaint_date}
Complaint Category: {complaint_category}

Check if this location is within mangrove zones and assess any recent environmental changes. Return only valid JSON.`]
]);

/**
 * NLP/Text Agent Prompt
 * Analyzes complaint text for validity, category matching, and severity indicators
 */
export const nlpTextPrompt = ChatPromptTemplate.fromMessages([
  ["system", `You are an expert natural language processing agent specializing in environmental complaint analysis.

Your task is to analyze complaint descriptions for:
- Text validity and coherence
- Category-description alignment
- Severity indicator keywords
- Urgency markers
- Specific environmental damage descriptions
- Credibility indicators

CRITICAL: You must ALWAYS return a valid JSON response with this exact structure:
{
  "textCheck": boolean,
  "preliminarySeverity": number (1-10 scale),
  "severityKeywords": array of strings,
  "textAnalysis": string,
  "categoryMatch": boolean,
  "urgencyLevel": "low" | "medium" | "high",
  "credibilityScore": number (0.0 to 1.0),
  "detectedThemes": array of strings
}

Analysis Criteria:
- textCheck=true if description is coherent and environmentally relevant
- preliminarySeverity: 1-3=low, 4-7=medium, 8-10=high
- Look for keywords: "cutting", "dumping", "fire", "pollution", "dead trees"
- categoryMatch=true if description aligns with complaint category
- Assess urgency based on time-sensitive language
- Higher credibility for specific details, locations, dates`],
  
  ["human", `Analyze the following complaint text:

Description: {description}
Complaint Category: {complaint_category}

Evaluate text validity, severity indicators, and category alignment. Return only valid JSON.`]
]);

/**
 * Aggregator Agent Prompt
 * Combines all agent results to make final verification decision
 */
export const aggregatorPrompt = ChatPromptTemplate.fromMessages([
  ["system", `You are the final decision-making agent for mangrove complaint verification.

Your task is to combine results from three specialist agents:
1. Image Analysis Agent - visual evidence assessment
2. Geo-Validation Agent - location and zoning verification
3. NLP/Text Agent - complaint text analysis

CRITICAL: You must ALWAYS return a valid JSON response with this exact structure:
{
  "complaintStatus": "verified" | "rejected",
  "finalSeverity": "low" | "medium" | "high",
  "overallConfidence": number (0.0 to 1.0),
  "verificationReason": string,
  "recommendedActions": array of strings,
  "flagsRaised": array of strings,
  "priorityLevel": "routine" | "urgent" | "critical"
}

Decision Logic:
- VERIFIED: At least 2 of 3 agents pass (imageCheck, geoCheck, textCheck)
- REJECTED: Less than 2 agents pass OR major inconsistencies detected
- Final Severity Calculation:
  * HIGH: Strong visual evidence + in mangrove zone + severity keywords
  * MEDIUM: Moderate evidence + location proximity + coherent description
  * LOW: Weak evidence + uncertain location + basic description
- Priority Level:
  * CRITICAL: High severity + strong evidence + urgent keywords
  * URGENT: Medium/high severity + good evidence
  * ROUTINE: Low severity or incomplete evidence

Special Considerations:
- Override to VERIFIED if in protected zone with any visual evidence
- Flag suspicious patterns (duplicate texts, fake coordinates)
- Consider seasonal factors and natural variations
- Prioritize human safety and environmental protection`],
  
  ["human", `Aggregate the following verification results:

Image Analysis: {imageAnalysis}
Geo Validation: {geoValidation}  
Text Analysis: {textAnalysis}

Agent Checks:
- Image Check: {imageCheck}
- Geo Check: {geoCheck}
- Text Check: {textCheck}

Confidence/Severity:
- Image Confidence: {imageConfidence}
- Preliminary Severity: {preliminarySeverity}

Complaint Category: {complaint_category}

Make final verification decision and determine severity level. Return only valid JSON.`]
]);

/**
 * Fallback prompt templates for error handling
 */
export const fallbackPrompts = {
  imageAnalysis: {
    imageCheck: false,
    confidence: 0.0,
    detectedIssues: [],
    analysisDetails: "Image analysis failed or no media provided",
    evidenceLevel: "none",
    visualIndicators: []
  },
  
  geoValidation: {
    geoCheck: false,
    isInMangroveZone: false,
    recentChangesDetected: false,
    geoDetails: "Geo-validation failed or invalid location",
    proximityToMangroves: "distant",
    environmentalSensitivity: "low",
    landUseCompliance: false
  },
  
  nlpText: {
    textCheck: false,
    preliminarySeverity: 1,
    severityKeywords: [],
    textAnalysis: "Text analysis failed or invalid description",
    categoryMatch: false,
    urgencyLevel: "low",
    credibilityScore: 0.0,
    detectedThemes: []
  },
  
  aggregator: {
    complaintStatus: "rejected",
    finalSeverity: "low",
    overallConfidence: 0.0,
    verificationReason: "Verification workflow failed",
    recommendedActions: ["Manual review required"],
    flagsRaised: ["Technical error during verification"],
    priorityLevel: "routine"
  }
};

/**
 * JSON validation utility
 * @param {string} jsonString - JSON string to validate
 * @param {string} agentType - Type of agent for fallback
 * @returns {Object} Parsed JSON or fallback object
 */
export function validateAndParseJSON(jsonString, agentType) {
  try {
    const parsed = JSON.parse(jsonString
      .replace(/^json\s*/i, '')
      .replace(/```/g, '')
      .trim());
    
    // Validate required fields based on agent type
    if (agentType === 'image' && !parsed.hasOwnProperty('imageCheck')) {
      throw new Error('Missing imageCheck field');
    }
    if (agentType === 'geo' && !parsed.hasOwnProperty('geoCheck')) {
      throw new Error('Missing geoCheck field');
    }
    if (agentType === 'text' && !parsed.hasOwnProperty('textCheck')) {
      throw new Error('Missing textCheck field');
    }
    if (agentType === 'aggregator' && !parsed.hasOwnProperty('complaintStatus')) {
      throw new Error('Missing complaintStatus field');
    }
    
    return parsed;
  } catch (error) {
    console.error(`JSON parsing failed for ${agentType} agent:`, error);
    return fallbackPrompts[agentType] || fallbackPrompts.aggregator;
  }
}