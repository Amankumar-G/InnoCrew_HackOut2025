import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import  User  from "../Schema/User.js"; // ✅ use your already created schema
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chat = async (req, res) => {
  try {
    const { userQuery } = req.body;
     const userData = await User.findById(req.user._id).select(
        "-password -__v -createdAt -updatedAt"
      );

    // ✅ 1. Fetch user summary from MongoDB
 
    const userSummary = "no summary available"
    // const userSummary = userData?.summary || "No summary available";

    // ✅ 2. Get related context from Qdrant
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "pdf-docs",
      }
    );

    const retriever = vectorStore.asRetriever({ k: 2 });
    const vectorResults = await retriever.invoke(userQuery);

    // ✅ 3. Combine both in system prompt
    const SYSTEM_PROMPT = `
      You are a helpful AI Assistant.
      Always answer based on the provided **User Summary** and **PDF Context**.

      User Summary:
      ${userSummary}

      PDF Context:
      ${JSON.stringify(vectorResults)}
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
      userSummary,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
