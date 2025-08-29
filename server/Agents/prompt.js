// prompt.js

import { ChatPromptTemplate } from "@langchain/core/prompts";

const principlePrompt = ChatPromptTemplate.fromTemplate(`
You are an expert educational curriculum planner.

Given a main Topic, a goal statement, and key deliverables, your job is to break it down into 3-5 meaningful Subtopics.

For each Subtopic, provide:
- name: The title of the subtopic.
- topic_prompt: A detailed description of what needs to be learned in that subtopic.
- goal_statement: A 1-2 sentence learning goal for the subtopic.
- key_deliverables_of_subtopic: A list of 2-4 important deliverables (skills or artifacts) for the subtopic.

Respond in pure JSON format (no markdown, no explanation). Example structure:
  The structure MUST be an array of objects. Each object MUST have exactly these fields:
        - "name" (string)
        - "topic_prompt" (string)
        - "goal_statement" (string)
        - "key_deliverables" (array of strings)

Main Topic: {Topic_Name}

Goal Statement: {goal_statement}

Key Deliverables: {key_deliverables}
`);

// prompt.js (continued)

const TeacherPrompt = ChatPromptTemplate.fromTemplate(`
    You are an expert subject teacher.
    
    Given a subtopic name, topic prompt, goal statement, and key deliverables for the subtopic, you need to create a detailed **learning guide** for the student.
    
    The guide should be in **markdown** format, and include:
    - A heading with the Subtopic Name.
    - A short introduction (2-3 sentences) based on the topic prompt.
    - A "Learning Objectives" section listing the key deliverables as bullet points.
    - A "Key Concepts" section that explains the main ideas.
    - A "Practice Tasks" section suggesting 2-3 small exercises.

    Main Input:
    - Subtopic Name: {subtopic_name}
    - Topic Prompt: {topic_prompt}
    - Goal Statement: {goal_statement}
    - Key Deliverables of Subtopic: {key_deliverables_of_subtopic}
    
    Only return clean **markdown** text. Do not include any extra explanation.
    `);
    
export { principlePrompt, TeacherPrompt };
    
