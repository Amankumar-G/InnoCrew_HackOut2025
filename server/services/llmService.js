// llmService.js
import { START, StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { quizPrompt } from "./prompt.js";
import { io } from '../config/socket.js';

// Initialize specialized LLM instance
const LLM = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.2 });

/**
 * Generate quiz questions based on subtopics
 * Input: { Array<{subtopic_name: string, goal_statement: string, key_deliverables: string[]}> }
 * Output: { Array<quiz_question> }
 */
async function quiz(state) {
  console.log("\n=== Quiz generation STARTED ===");
  io.emit("message", "\n=== Quiz generation STARTED ===");

  // Loop over all subtopics to generate questions
    let allQuizQuestions = [];
    console.log(state.subtopics);
    const prompt = quizPrompt;
    const chain = prompt.pipe(LLM);
    const response = await chain.invoke(state);
    console.log(response.content)
    const quizez = JSON.parse(response.content
        .replace(/^.*?\[/s, '[')
        .replace(/\s*```+\s*$/g, '')
        .trim());
    allQuizQuestions = [...allQuizQuestions, ...quizez];

  console.log("Quiz generation:", allQuizQuestions);
  io.emit("quiz generation:", allQuizQuestions);
  
  return { generatedQuizez: allQuizQuestions.slice(0, 30) }; // Return the first 30 questions
}

async function generateQuestionsWithLLM(subtopics) {
  const workflow = new StateGraph({
    channels: {
      subtopics: { default: () => subtopics, aggregate: "last" },
      generatedQuizez: { default: () => null, aggregate: "last" },
    },
  });

  workflow.addNode("quiz", quiz);

  workflow.addEdge(START, "quiz");
  workflow.addEdge("quiz", END);

  const app = workflow.compile();
  const finalState = await app.invoke({ subtopics });

  return finalState.generatedQuizez;
}

export { generateQuestionsWithLLM };
