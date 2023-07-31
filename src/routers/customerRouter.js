import { Router } from 'express';
import { readCustomer, readCustomerId, createCustomer } from '../controllers/customerControllers.js';
import { customerValidator } from '../middleware/customerValidator.js';

const router = Router();

router.get('/customers', readCustomer);
router.get('/customers/:id', readCustomerId);
router.post('/customers', customerValidator, createCustomer);

export default router;