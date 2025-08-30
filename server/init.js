// init.js
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from "dotenv";

dotenv.config();

async function init() {
  try {
    const filePath = "E:/Best-Practice-Guidelines-for-Mangrove-Restoration_spreadsv5[1].pdf"; 
    // 1. Load the PDF
    console.log("📄 Loading PDF:", filePath);
    const loader = new PDFLoader(filePath);
    const rawDocs = await loader.load();

    // 2. Split text into chunks (better for embeddings)
    const splitter = new CharacterTextSplitter({
      separator: "\n",
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await splitter.splitDocuments(rawDocs);

    console.log(`✅ Loaded and split into ${docs.length} chunks`);

    // 3. Create embeddings
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 4. Initialize / connect vector store
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: "http://localhost:6333", // e.g. http://localhost:6333
      collectionName: "pdf-docs",
    });

    // 5. Add documents only if not already present
    // Optional: you can check collection info if you want strict "once only"
    await vectorStore.addDocuments(docs);

    console.log("🎉 PDF uploaded & embedded into Qdrant successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error uploading PDF:", err);
    process.exit(1);
  }
}

init();
