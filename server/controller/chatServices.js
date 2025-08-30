import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import User from "../Schema/User.js";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chat = async (req, res) => {
  try {
    const { userQuery } = req.body;

    // ✅ 1. Fetch user data
    const userData = await User.findById(req.user._id).select(
      "-password -__v -createdAt -updatedAt"
    );

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const userSummary = userData?.summary;

    // ✅ 2. Setup embeddings & Qdrant
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "pdf-docs", // ⚡️use dedicated collection for user + pdf
      }
    );

    const retriever = vectorStore.asRetriever({ k: 3 });
    const vectorResults = await retriever.invoke(userQuery);

    console.log("📌 Retrieved Context:", vectorResults);

    // ✅ 3. Build strong restrictive system prompt
    const SYSTEM_PROMPT = `
      You are helpful AI assistant.
        Always answer based on the provided **User Summary** and **PDF Context** provided below. 
      - If the context is empty do not reply."
      - Do NOT use any prior knowledge.
      - Do NOT guess or make up information.
      - ONLY rely on the **User Summary** and **PDF Context**.
      User Summary: ${userSummary} 
      PDF Context: ${JSON.stringify(vectorResults)}
  
    `;

    // ✅ 4. Get AI response
    const chatResult = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userQuery },
      ],
    });

    return res.json({
      message: chatResult.choices[0].message.content,
      docs: vectorResults,
    });

  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


