import { Router } from 'express';
import { readCustomer, readCustomerId, createCustomer, updateCustomer } from '../controllers/customerControllers.js';
import { customerValidator } from '../middleware/customerValidator.js';

const router = Router();

router.get('/customers', readCustomer);
router.get('/customers/:id', readCustomerId);
router.post('/customers', customerValidator, createCustomer);
router.put('/customers/:id', customerValidator, updateCustomer);

export default router;