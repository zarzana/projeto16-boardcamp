import { Router } from 'express';
import { readCustomer } from '../controllers/customerControllers.js';

const router = Router();

router.get('/customers', readCustomer);

export default router;