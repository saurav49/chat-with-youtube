import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler';
import router from './routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/v1', router);
app.use(errorHandler);

export default app;
