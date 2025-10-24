import { OpenAIEmbeddings } from '@langchain/openai';
import { Request, Response } from 'express';
import { config } from '../config/env';
import { QdrantVectorStore } from '@langchain/qdrant';
import {
  classifierSystemPrompt,
  generateChunkText,
  systemPrompt,
} from '../config/utils';

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { fetchTranscript } from 'youtube-transcript-plus';

export async function llmResponse(_req: Request, res: Response) {
  try {
    console.time(`llmResponse`);
    const { query, videoId, url } = _req.body;
    const headerAuth = _req.get('Authorization');
    const fromBearer = headerAuth?.toLocaleLowerCase().startsWith('bearer ')
      ? headerAuth.slice(7).trim()
      : undefined;
    if (!fromBearer) {
      res.status(401).json({
        status: 'ERROR',
        message: 'Unauthorized',
      });
      return;
    }
    if (!query || typeof query !== 'string') {
      res.status(400).json({
        status: 'ERROR',
        message: 'query is required in request body',
      });
      return;
    }
    if (!videoId || typeof query !== 'string') {
      res.status(400).json({
        status: 'ERROR',
        message: 'videoId is required in request body',
      });
      return;
    }
    if (!url || typeof query !== 'string') {
      res.status(400).json({
        status: 'ERROR',
        message: 'URL is required in request body',
      });
      return;
    }
    const classifier = classifierSystemPrompt(query);
    const { text } = await generateText({
      model: openai(config.GPT_MODEL_NAME ?? ''),
      prompt: `${classifier}`,
      temperature: 0,
      maxOutputTokens: 200,
    });
    const out = text && typeof text === 'string' ? JSON.parse(text) : text;
    if (out && out.intent === 'FULL' && out.confidence > 0.5) {
      const youtubeTranscriptInfo = await fetchTranscript(url);
      const fullTranscript = youtubeTranscriptInfo
        .map((item) => item.text)
        .join(' ');

      const chunks = generateChunkText(fullTranscript, 8000);
      const chunkSummary = [];
      for (const chunk of chunks) {
        const sysPrompt = `You are a concise summarizer. Summarize this transcript chunk into 4-6 bullet points:\n\n${chunk}`;
        const { text } = await generateText({
          model: openai(config.GPT_MODEL_NAME ?? ''),
          prompt: `${sysPrompt}`,
        });
        chunkSummary.push(text);
      }
      const merged = chunkSummary.join(' ');
      const sys = `Combine and condense the following chunk summaries into a concise, well-structured summary with main takeaways and timestamps if possible:\n\n${merged}\n\nUser question: ${query}`;
      const { text } = await generateText({
        model: openai(config.GPT_MODEL_NAME ?? ''),
        prompt: `${sys}`,
      });
      console.timeEnd(`llmResponse`);
      res.status(200).json({
        status: 'OK',
        data: text,
      });
    } else {
      const embeddings = new OpenAIEmbeddings({
        apiKey: fromBearer ?? config.OPENAI_API_KEY,
        model: config.EMBEDDING_MODEL_NAME,
      });
      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          url: config.QDRANT_URL,
          collectionName: videoId,
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
      const finalChunks =
        goodScore.length > 0 ? goodScore : similaritySearch.slice(0, 3);
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
      console.timeEnd(`llmResponse`);
      res.status(200).json({
        status: 'OK',
        data: text,
      });
    }
  } catch (error) {
    console.error({ error });
    res.status(500).json({
      status: 'ERROR',
      message: 'Internal Server Error',
    });
  }
}
