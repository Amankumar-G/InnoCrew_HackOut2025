import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from 'dotenv'
dotenv.config();
import { Worker } from "bullmq";

const worker = new Worker('file-upload-queue',
    async (job)=>{
        const data = JSON.parse(job.data)
        console.log('job',job.data)

        // Load the Pdf
        const loader = new PDFLoader(data.path);
        const docs = await loader.load();

        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-small",
            apiKey: process.env.OPENAI_API_KEY
          });
        console.log(embeddings)
        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: process.env.QDRANT_URL,
            collectionName: "pdf-docs",
          });  

       await vectorStore.addDocuments(docs);
       console.log("All Docs are Added");   
    },
    {concurrency:100,connection:{
        host:'localhost',
        port: '6379'
    }}
)