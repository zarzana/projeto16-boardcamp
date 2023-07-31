import { Router } from 'express';
import customerRouter from './customerRouter.js';
import gameRouter from './gameRouter.js';
import rentalRouter from './rentalRouter.js';

const router = Router();
router.use(customerRouter);
router.use(gameRouter);
router.use(rentalRouter);

export default router;