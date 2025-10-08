import { Request, Response } from 'express';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { config } from '../config/env';
import { fetchTranscript } from 'youtube-transcript-plus';

export async function transcribeVideo(_req: Request, res: Response) {
  const { url } = _req.body;
  if (!url || typeof url !== 'string') {
    res.status(400).json({
      status: 'ERROR',
      message: 'Valid url is required',
    });
    return;
  }
  const youtubeTranscriptInfo = await fetchTranscript(url);
  let start = 0;
  const INTERVAL = 20;
  const docs =
    Array.isArray(youtubeTranscriptInfo) && youtubeTranscriptInfo.length > 0
      ? youtubeTranscriptInfo.reduce(
          (acc, curr) => {
            if (!acc[`${start}` as keyof typeof acc]) {
              acc[`${start}` as keyof typeof acc] = {
                start: curr.offset,
                end: start + INTERVAL,
                text: acc[`${start}` as keyof typeof acc]?.text
                  ? acc[`${start}` as keyof typeof acc].text + curr.text
                  : curr.text,
              };
            } else {
              if (Math.floor(curr.offset) <= Math.floor(start + INTERVAL)) {
                acc[`${start}` as keyof typeof acc] = {
                  ...acc[`${start}` as keyof typeof acc],
                  end: start + INTERVAL,
                  text: acc[`${start}` as keyof typeof acc].text + curr.text,
                };
              } else {
                acc[`${start}` as keyof typeof acc] = {
                  ...acc[`${start}` as keyof typeof acc],
                  end: start + INTERVAL,
                  text: acc[`${start}` as keyof typeof acc].text + curr.text,
                };
                start += INTERVAL;
              }
            }
            return acc;
          },
          {} as Record<
            string,
            {
              start?: number;
              end: number;
              text: string;
            }
          >,
        )
      : undefined;
  if (!docs) {
    res.status(400).json({
      status: 'ERROR',
      message: 'No youtube transcript found, please try another video',
    });
    return;
  }

  const docsWithMetadata = Object.keys(docs).map((startTime, idx) => ({
    pageContent: docs[startTime].text,
    metadata: {
      start: docs[startTime].start,
      end: docs[startTime].end,
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
