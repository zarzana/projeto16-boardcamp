import { Router } from 'express';
import clientRouter from './clientRouter.js';
import gameRouter from './gameRouter.js';
import rentRouter from './rentRouter.js';

const router = Router();
router.use(clientRouter);
router.use(gameRouter);
router.use(rentRouter);

export default router;