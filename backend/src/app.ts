import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import errorHandler from './middlewares/errorHandler';
import router from './routes';

dotenv.config();

const app = express();

// --- DEBUG: Very early manual CORS middleware (guarantees headers) ---
app.use((req, res, next) => {
  console.log(
    '[CORS DEBUG] origin:',
    req.headers.origin,
    'method:',
    req.method,
    'url:',
    req.url,
  );

  // Force these headers for all responses (safe for local development)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With',
  );

  if (req.method === 'OPTIONS') {
    // Respond to preflight immediately
    return res.sendStatus(204);
  }
  next();
});

// Optional: still ok to use cors() afterwards, but manual middleware above is the fallback
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  }),
);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());
app.use('/api/v1', router);
app.use(errorHandler);

export default app;
