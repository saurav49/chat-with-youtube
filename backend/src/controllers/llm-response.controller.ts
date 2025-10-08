import { OpenAIEmbeddings } from '@langchain/openai';
import { Request, Response } from 'express';
import { config } from '../config/env';
import { QdrantVectorStore } from '@langchain/qdrant';
import { systemPrompt } from '../config/utils';

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function llmResponse(_req: Request, res: Response) {
  const { query } = _req.body;
  if (!query || typeof query !== 'string') {
    res.status(400).json({
      status: 'ERROR',
      message: 'query is required in request body',
    });
    return;
  }
  const embeddings = new OpenAIEmbeddings({
    apiKey: config.OPENAI_API_KEY,
    model: config.EMBEDDING_MODEL_NAME,
  });
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: config.QDRANT_URL,
      collectionName: 'yt-vid',
    },
  );
  const k = 5;
  const similaritySearch = await vectorStore.similaritySearchWithScore(
    query,
    k,
  );
  const MIN_SCORE = 0.75;
  const goodScore = similaritySearch.filter(
    ([document, score]) => score > MIN_SCORE,
  );
  const finalChunks = goodScore.length > 0 ? goodScore : goodScore.slice(0, 3);
  const relevantChunks = finalChunks
    .map(
      ([d, score]) =>
        `ID: ${d.id}\nSCORE:${score}\nCONTENT:${d.pageContent}\nMETADATA:${JSON.stringify(d.metadata, null)}`,
    )
    .join('\n');

  const sys = systemPrompt(relevantChunks, query);

  const { text } = await generateText({
    model: openai(config.GPT_MODEL_NAME ?? ''),
    prompt: `${sys}\n\nUser: ${query}`,
  });

  res.status(200).json({
    status: 'OK',
    data: text,
  });
}
