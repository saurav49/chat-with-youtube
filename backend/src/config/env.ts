import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  QDRANT_URL: process.env.QDRANT_URL,
  EMBEDDING_MODEL_NAME: process.env.EMBEDDING_MODEL_NAME,
  GPT_MODEL_NAME: process.env.GPT_MODEL_NAME,
};
