import { Router } from 'express';
import { readCustomer, readCustomerId } from '../controllers/customerControllers.js';

const router = Router();

router.get('/customers', readCustomer);
router.get('/customers/:id', readCustomerId);

export default router;