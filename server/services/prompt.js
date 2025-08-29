// prompt.js

import { ChatPromptTemplate } from "@langchain/core/prompts";

const quizPrompt = ChatPromptTemplate.fromTemplate(`
YAct as a personalized quiz generator.
Based on the given topics {subtopics}, generate exactly 15 quiz questions.

For each question:

Provide 4 answer options labeled a, b, c, and d.

Randomly assign the correct answer among the options.

Specify the correct option using the key correct_option.

Output only a JSON array of objects, where each object contains:

question: a string containing the question.

options: an object with keys a, b, c, and d mapping to option texts.

correct_option: a single key (a, b, c, or d) indicating the correct answer.

Do not include any explanations, comments, or additional text.
Only output the JSON array as the final result.
`);

export { quizPrompt };
    
