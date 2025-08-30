// init.js
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from "dotenv";

dotenv.config();

async function init() {
  try {
    const filePath = "C:/Users/avani/Downloads/pdfcontent.pdf";

    console.log("📄 Loading PDF:", filePath);
    const loader = new PDFLoader(filePath);
    const rawDocs = await loader.load();

    const splitter = new CharacterTextSplitter({
      separator: "\n",
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await splitter.splitDocuments(rawDocs);
    console.log(`✅ Loaded and split into ${docs.length} chunks`);

    // Embeddings
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: process.env.OPENAI_API_KEY,
    });

    // OPTION A: Create the collection (if it doesn't exist) and upload in one go
    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANT_URL,          // e.g. https://...cloud.qdrant.io:6333
      apiKey: process.env.QDRANT_API_KEY,   // <-- Cloud DB API key
      collectionName: "pdf-docs",
    });

    // OPTION B: If the collection already exists, connect and add docs
    // const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    //   url: process.env.QDRANT_URL,
    //   apiKey: process.env.QDRANT_API_KEY,
    //   collectionName: "pdf-docs",
    // });
    // await vectorStore.addDocuments(docs);

    console.log("🎉 PDF uploaded & embedded into Qdrant Cloud successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error uploading PDF:", err);
    process.exit(1);
  }
}

init();

