import { Request, Response } from 'express';
import { YoutubeLoader } from '@langchain/community/document_loaders/web/youtube';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { config } from '../config/env';

export async function transcribeVideo(_req: Request, res: Response) {
  const { url } = _req.body;
  const loader = YoutubeLoader.createFromUrl(url, {
    language: 'en',
    addVideoInfo: true,
  });

  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await textSplitter.splitDocuments(docs);
  const docsWithMetadata = splitDocs.map((doc, idx) => ({
    pageContent: doc.pageContent,
    metadata: {
      source: doc.metadata.source,
      description: doc.metadata.description,
      title: doc.metadata.title,
      chunkIndex: idx,
    },
  }));

  const embeddings = new OpenAIEmbeddings({
    apiKey: config.OPENAI_API_KEY,
    model: config.EMBEDDING_MODEL_NAME,
  });
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_URL,
      collectionName: 'yt-vid',
    },
  );
  await vectorStore.addDocuments(docsWithMetadata);
  res.status(200).json({
    status: 'OK',
    data: docsWithMetadata,
  });
}
