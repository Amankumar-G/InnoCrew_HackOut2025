import { START, StateGraph, END } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { principlePrompt,TeacherPrompt} from "./prompt.js";
import { io } from '../config/socket.js';

// Initialize specialized LLM instances
const principleLLM = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.2 });
const TeacherLLm = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.1 });


/**
 * Principle Node - Find the subtopics to learn
 * Input: { Topic_Name: string, goal_statement: string ,key_deliverables : string[]}
 * Output: {  subtopics: Array<{name, topic_prompt, goal_statement : string, key_deliverables_of_subtopic : string[]}> }
 */
async function principle(state) {
  console.log("\n===Principle ANALYSIS STARTED ===");
  io.emit("message", "\n=== Principle ANALYSIS STARTED ===");
  console.log(state)
  const prompt = principlePrompt;
  const chain = prompt.pipe(principleLLM);
  const response = await chain.invoke(state);
  const subTopics = JSON.parse(response.content
    .replace(/^json\s*/i, '')
    .replace(/```/g, '')
    .trim());
    console.log("Principle Evaluation:", subTopics);
    console.log("Identified components:", subTopics.map(c => c.name));
  io.emit("Principle Evaluation", subTopics);
  
  return { principleTopics: subTopics };
}

/**
 * Teacher Node - learn a specific subtopic
 * Input: { subtopic_name: string, topic_prompt: string, goal_statement: string, key_deliverables_of_subtopic: string[] }
 * output : { markDown : string}
 */
async function teacher(state) {
  console.log("\n=== Teacher ANALYSIS STARTED ===");
  io.emit("message", "\n=== Teacher ANALYSIS STARTED ===");
  
  const prompt = TeacherPrompt;
  const chain = prompt.pipe(TeacherLLm);
  const response = await chain.invoke(state);
  const evaluation = response.content;
  console.log("Teacher Evaluation:", response.content);
  io.emit("tech-evaluation", evaluation);
  
  return { teacherLearning: evaluation };
}

async function runTeaching(Topic_Name, goal_statement, key_deliverables) {
    const workflow = new StateGraph({
      channels: {
        Topic_Name: { default: () => Topic_Name, aggregate: "last" },
        goal_statement: { default: () => goal_statement, aggregate: "last" },
        key_deliverables: { default: () => key_deliverables, aggregate: "last" },
        principleTopics: { default: () => null, aggregate: "last" },
        teacherLearning: { default: () => [], aggregate: "last" },
      },
    });
  
    workflow.addNode("principle", principle);
  
    workflow.addNode("teacher", async (state) => {
      const principleTopics = state.principleTopics || [];
      const allResults = [];
  
      if (principleTopics.length === 0) {
        console.warn("No subtopics found to teach.");
        return { teacherLearning: [] };
      }
  
      for (let idx = 0; idx < principleTopics.length; idx++) {
        const subtopic = principleTopics[idx];
        console.log(`\n=== Teacher Analysis for Subtopic: ${subtopic.name} STARTED ===`);
        io.emit("message", `\n=== Teacher Analysis for Subtopic: ${subtopic.name} STARTED ===`);
  
        const teacherInput = {
          subtopic_name: subtopic.name,
          topic_prompt: subtopic.topic_prompt,
          goal_statement: subtopic.goal_statement,
          key_deliverables_of_subtopic: subtopic.key_deliverables_of_subtopic,
        };
  
        const result = await teacher(teacherInput);
        allResults.push(result.teacherLearning);
  
        io.emit("subtopicDone", { subtopic: subtopic.name, index: idx }); // optional progress feedback
      }
  
      return { teacherLearning: allResults };
    });
  
    workflow.addEdge(START, "principle");
    workflow.addEdge("principle", "teacher");
    workflow.addEdge("teacher", END);
  
    const app = workflow.compile();
    const finalState = await app.invoke({
      Topic_Name,
      goal_statement,
      key_deliverables,
    });
    
    return finalState;
  }
  
  
export { runTeaching };