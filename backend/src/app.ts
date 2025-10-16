import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import errorHandler from './middlewares/errorHandler';
import router from './routes';

dotenv.config();

const app = express();

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
