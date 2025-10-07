import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';
import { transcribeVideo } from '../controllers/transcribe-video.controller';
import { llmResponse } from '../controllers/llm-response.controller';

const router = Router();

router.get('/health', healthCheck);
router.route('/transcribe-video').post(transcribeVideo);
router.route('/query').post(llmResponse);

export default router;
