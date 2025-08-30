// plantationPrompts.js
import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * Data Validation Agent Prompt
 * Validates the consistency and logical correctness of plantation submission data
 */
const dataValidationPrompt = ChatPromptTemplate.fromTemplate(`
You are a specialized Data Validation Agent for plantation verification. Your task is to validate the consistency and logical correctness of plantation submission data.

PLANTATION DATA TO VALIDATE:
- Plantation Name: {plantationName}
- Area: {area} hectares
- Species: {species}
- Planting Date: {plantingDate}
- Survival Rate: {survivalRate}%
- Expected Carbon Credit: {expectedCarbonCredit}
- Submission Date: {submissionDate}

VALIDATION CHECKLIST:
1. Data Completeness: All required fields present and non-empty
2. Date Logic: Planting date not in future, reasonable time since planting
3. Survival Rate: Realistic percentage (0-100%), consistent with time elapsed
4. Species Validation: Known mangrove/tree species, appropriate for region
5. Area Reasonableness: Area matches expected scale (not impossibly large/small)
6. Carbon Credit Logic: Expected credits align with area and species
7. Timeline Consistency: Submission date after planting date

SCORING CRITERIA:
- Perfect data: 90-100 points
- Minor issues: 70-89 points  
- Moderate issues: 50-69 points
- Major issues: 30-49 points
- Critical issues: 0-29 points

CRITICAL: You must ALWAYS return a valid JSON response with this exact structure:
{{
  "dataCheck": boolean,
  "confidence": number (0.0 to 1.0),
  "score": number (0-100),
  "findings": array of strings,
  "warnings": array of strings,
  "errors": array of strings,
  "validationDetails": {{
    "completenessCheck": boolean,
    "dateLogicCheck": boolean,
    "survivalRateCheck": boolean,
    "speciesValidityCheck": boolean,
    "areaReasonablenessCheck": boolean,
    "carbonCreditLogicCheck": boolean,
    "timelineConsistencyCheck": boolean
  }}
}}
DO NOT use markdown formatting, code blocks, or "JSON" tags. Return ONLY the raw JSON object.
`);

/**
 * Image Verification Agent Prompt  
 * Analyzes plantation images for authenticity and evidence of actual plantation activity
 */
const imageVerificationPrompt = ChatPromptTemplate.fromTemplate(`
You are a specialized Image Verification Agent for plantation verification. Your task is to analyze plantation images for authenticity and evidence of actual plantation activity.

PLANTATION CONTEXT:
- Plantation Name: {plantationName}
- Species: {species}
- Area: {area} hectares
- Planting Date: {plantingDate}
- Images to analyze: {images}

ANALYSIS CHECKLIST:
1. Image Authenticity: Real photos vs stock images, no obvious manipulation
2. Vegetation Evidence: Actual trees/saplings visible, appropriate density
3. Species Consistency: Visible vegetation matches claimed species types
4. Plantation Activity: Evidence of organized planting, not natural forest
5. Image Quality: Clear, recent photos with good lighting
6. Scale Consistency: Visible area roughly matches claimed plantation size
7. Age Appropriateness: Tree/sapling age consistent with planting date

SCORING CRITERIA:
- Excellent evidence: 90-100 points
- Good evidence: 70-89 points
- Moderate evidence: 50-69 points  
- Weak evidence: 30-49 points
- No/poor evidence: 0-29 points

CRITICAL: You must ALWAYS return a valid JSON response with this exact structure:
{{
  "imageCheck": boolean,
  "confidence": number (0.0 to 1.0),
  "score": number (0-100),
  "vegetationDetected": boolean,
  "findings": array of strings,
  "warnings": array of strings,
  "errors": array of strings,
  "imageDetails": {{
    "totalImages": number,
    "validImages": number,
    "suspiciousImages": number,
    "authenticityCheck": boolean,
    "vegetationDensity": "low" | "medium" | "high",
    "speciesMatch": boolean,
    "plantationEvidence": boolean,
    "ageConsistency": boolean
  }}
}}
DO NOT use markdown formatting, code blocks, or "JSON" tags. Return ONLY the raw JSON object.
`);

/**
 * Document Verification Agent Prompt
 * Validates certificates and supporting documents for authenticity and consistency
 */
const documentVerificationPrompt = ChatPromptTemplate.fromTemplate(`
You are a specialized Document Verification Agent for plantation verification. Your task is to validate certificates and supporting documents for authenticity and consistency.

PLANTATION CONTEXT:
- Planting Date: {plantingDate}
- Species: {species}
- Location: {location}
- Soil Certificate: {soilCertificate}
- Plant Certificate: {plantCertificate}
- Additional Documents: {additionalDocs}

VERIFICATION CHECKLIST:
1. Document Presence: Required certificates are provided
2. Format Validity: Documents appear to be genuine certificates/reports
3. Date Consistency: Certificate dates align with planting timeline
4. Authority Validation: Documents from recognized/credible sources
5. Content Relevance: Certificate content matches plantation details
6. Quality Assessment: Documents are clear and complete
7. Cross-Reference: Multiple documents support each other

SCORING CRITERIA:
- All documents valid: 90-100 points
- Most documents valid: 70-89 points
- Some documents valid: 50-69 points
- Few documents valid: 30-49 points
- No valid documents: 0-29 points

CRITICAL: You must ALWAYS return a valid JSON response with this exact structure:
{{
  "documentCheck": boolean,
  "confidence": number (0.0 to 1.0),
  "score": number (0-100),
  "certificatesValid": boolean,
  "findings": array of strings,
  "warnings": array of strings,
  "errors": array of strings,
  "documentDetails": {{
    "soilCertificate": {{
      "present": boolean,
      "valid": boolean,
      "dateConsistent": boolean,
      "authorityRecognized": boolean
    }},
    "plantCertificate": {{
      "present": boolean,
      "valid": boolean,
      "dateConsistent": boolean,
      "authorityRecognized": boolean
    }},
    "additionalDocs": {{
      "count": number,
      "validCount": number,
      "supportingEvidence": boolean
    }}
  }}
}}
DO NOT use markdown formatting, code blocks, or "JSON" tags. Return ONLY the raw JSON object.
`);

/**
 * Location Verification Agent Prompt
 * Validates geographic data and assesses location suitability for the claimed plantation
 */
const locationVerificationPrompt = ChatPromptTemplate.fromTemplate(`
You are a specialized Location Verification Agent for plantation verification. Your task is to validate geographic data and assess location suitability for the claimed plantation.

PLANTATION CONTEXT:
- Plantation Name: {plantationName}
- Location: {location}
- Species: {species}
- Area: {area} hectares
- Planting Date: {plantingDate}

VERIFICATION CHECKLIST:
1. Coordinate Validity: Latitude/longitude are valid and precise
2. Address Consistency: Address matches coordinates reasonably
3. Species Suitability: Location climate/soil suitable for claimed species
4. Mangrove Region: Area is known mangrove habitat or suitable for restoration
5. Area Feasibility: Claimed area is realistic for the location
6. Conservation Status: Check if area is protected/restricted land
7. Environmental Factors: Proximity to water, soil conditions, climate match

SCORING CRITERIA:
- Perfect location match: 90-100 points
- Good location match: 70-89 points
- Moderate suitability: 50-69 points
- Poor suitability: 30-49 points
- Unsuitable location: 0-29 points

CRITICAL: You must ALWAYS return a valid JSON response with this exact structure:
{{
  "locationCheck": boolean,
  "confidence": number (0.0 to 1.0),
  "score": number (0-100),
  "suitableForSpecies": boolean,
  "mangroveRegion": boolean,
  "findings": array of strings,
  "warnings": array of strings,
  "errors": array of strings,
  "locationDetails": {{
    "coordinatesValid": boolean,
    "addressConsistency": boolean,
    "climateMatch": boolean,
    "soilSuitability": boolean,
    "waterProximity": boolean,
    "conservationArea": boolean,
    "areaFeasibility": boolean,
    "riskFactors": array of strings
  }}
}}
DO NOT use markdown formatting, code blocks, or "JSON" tags. Return ONLY the raw JSON object.
`);

/**
 * Aggregator Agent Prompt
 * Combines results from all verification agents and makes the final verification decision
 */
const plantationAggregatorPrompt = ChatPromptTemplate.fromTemplate(`
You are the Aggregator Agent for plantation verification. Your task is to combine results from all verification agents and make the final verification decision.

AGENT RESULTS:
Data Validation: {dataAnalysis}
Image Verification: {imageAnalysis}  
Document Verification: {documentAnalysis}
Location Verification: {locationAnalysis}

INDIVIDUAL CHECKS:
- Data Check: {dataCheck}
- Image Check: {imageCheck}
- Document Check: {documentCheck}
- Location Check: {locationCheck}

CONFIDENCE SCORES:
- Data Confidence: {dataConfidence}
- Image Confidence: {imageConfidence}
- Document Confidence: {documentConfidence}
- Location Confidence: {locationConfidence}

INDIVIDUAL SCORES:
- Data Score: {dataScore}/100
- Image Score: {imageScore}/100
- Document Score: {documentScore}/100
- Location Score: {locationScore}/100

PLANTATION CONTEXT:
- Name: {plantationName}
- Area: {area} hectares
- Species: {species}
- Survival Rate: {survivalRate}%

DECISION LOGIC:
1. Calculate weighted overall score: (DataScore×0.25 + ImageScore×0.35 + DocumentScore×0.25 + LocationScore×0.15)
2. Determine status:
   - Score ≥ 80: "verified_by_ai"
   - Score 60-79: "admin_verification_needed" (manual review)
   - Score < 60: "rejected"
3. Calculate carbon credits based on verification success and plantation metrics
4. Identify any severity flags for manual review

CARBON CREDIT CALCULATION:
- Only award credits for verified plantations (score ≥ 80)
- Base formula: area × (survivalRate/100) × species_multiplier × (score/100)
- Mangrove species get higher multipliers (1.2-1.5x)
- Other species get lower multipliers (0.6-1.0x)

CRITICAL: You must ALWAYS return a valid JSON response with this exact structure:
{{
  "finalStatus": "verified_by_ai" | "pending_verification" | "rejected",
  "overallScore": number (0-100),
  "aggregatedConfidence": number (0.0 to 1.0),
  "carbonCreditGenerated": number,
  "severityFlags": array of strings,
  "verificationSummary": string,
  "reasoning": string,
  "recommendations": array of strings,
  "agentScores": {{
    "dataScore": number,
    "imageScore": number,
    "documentScore": number,
    "locationScore": number
  }},
  "checksPassed": {{
    "dataCheck": boolean,
    "imageCheck": boolean,
    "documentCheck": boolean,
    "locationCheck": boolean,
    "totalPassed": number
  }}
}}
DO NOT use markdown formatting, code blocks, or "JSON" tags. Return ONLY the raw JSON object.
`);

/**
 * Fallback response templates for error handling
 */
export const fallbackPrompts = {
  dataValidation: {
    dataCheck: false,
    confidence: 0.0,
    score: 0,
    findings: [],
    warnings: [],
    errors: ["Data validation failed"],
    validationDetails: {
      completenessCheck: false,
      dateLogicCheck: false,
      survivalRateCheck: false,
      speciesValidityCheck: false,
      areaReasonablenessCheck: false,
      carbonCreditLogicCheck: false,
      timelineConsistencyCheck: false
    }
  },
  
  imageVerification: {
    imageCheck: false,
    confidence: 0.0,
    score: 0,
    vegetationDetected: false,
    findings: [],
    warnings: [],
    errors: ["Image verification failed or no images provided"],
    imageDetails: {
      totalImages: 0,
      validImages: 0,
      suspiciousImages: 0,
      authenticityCheck: false,
      vegetationDensity: "low",
      speciesMatch: false,
      plantationEvidence: false,
      ageConsistency: false
    }
  },
  
  documentVerification: {
    documentCheck: false,
    confidence: 0.0,
    score: 0,
    certificatesValid: false,
    findings: [],
    warnings: [],
    errors: ["Document verification failed"],
    documentDetails: {
      soilCertificate: {
        present: false,
        valid: false,
        dateConsistent: false,
        authorityRecognized: false
      },
      plantCertificate: {
        present: false,
        valid: false,
        dateConsistent: false,
        authorityRecognized: false
      },
      additionalDocs: {
        count: 0,
        validCount: 0,
        supportingEvidence: false
      }
    }
  },
  
  locationVerification: {
    locationCheck: false,
    confidence: 0.0,
    score: 0,
    suitableForSpecies: false,
    mangroveRegion: false,
    findings: [],
    warnings: [],
    errors: ["Location verification failed"],
    locationDetails: {
      coordinatesValid: false,
      addressConsistency: false,
      climateMatch: false,
      soilSuitability: false,
      waterProximity: false,
      conservationArea: false,
      areaFeasibility: false,
      riskFactors: []
    }
  },
  
  aggregator: {
    finalStatus: "rejected",
    overallScore: 0,
    aggregatedConfidence: 0.0,
    carbonCreditGenerated: 0.0,
    severityFlags: ["Technical error during verification"],
    verificationSummary: "Verification workflow failed",
    reasoning: "System error prevented proper verification",
    recommendations: ["Manual review required"],
    agentScores: {
      dataScore: 0,
      imageScore: 0,
      documentScore: 0,
      locationScore: 0
    },
    checksPassed: {
      dataCheck: false,
      imageCheck: false,
      documentCheck: false,
      locationCheck: false,
      totalPassed: 0
    }
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
    if (agentType === 'dataValidation' && !parsed.hasOwnProperty('dataCheck')) {
      throw new Error('Missing dataCheck field');
    }
    if (agentType === 'imageVerification' && !parsed.hasOwnProperty('imageCheck')) {
      throw new Error('Missing imageCheck field');
    }
    if (agentType === 'documentVerification' && !parsed.hasOwnProperty('documentCheck')) {
      throw new Error('Missing documentCheck field');
    }
    if (agentType === 'locationVerification' && !parsed.hasOwnProperty('locationCheck')) {
      throw new Error('Missing locationCheck field');
    }
    if (agentType === 'aggregator' && !parsed.hasOwnProperty('finalStatus')) {
      throw new Error('Missing finalStatus field');
    }
    
    return parsed;
  } catch (error) {
    console.error(`JSON parsing failed for ${agentType} agent:`, error);
    return fallbackPrompts[agentType] || fallbackPrompts.aggregator;
  }
}

export { 
  dataValidationPrompt, 
  imageVerificationPrompt, 
  documentVerificationPrompt, 
  locationVerificationPrompt, 
  plantationAggregatorPrompt 
};