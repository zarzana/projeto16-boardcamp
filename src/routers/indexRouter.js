import { Router } from 'express';
import customerRouter from './customerRouter.js';
import gameRouter from './gameRouter.js';
import rentRouter from './rentRouter.js';

const router = Router();
router.use(customerRouter);
router.use(gameRouter);
router.use(rentRouter);

export default router;