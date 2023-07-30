import { Router } from 'express';
import { readGame, createGame } from '../controllers/gameControllers.js';
import { gameValidator } from '../middleware/gameValidator.js';

const router = Router();

router.get('/games', readGame);
router.post('/games', gameValidator, createGame);

export default router;