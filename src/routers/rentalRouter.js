import { Router } from 'express';
import { readRental, createRental } from '../controllers/rentalControllers.js';
import { rentalValidator } from '../middleware/rentalValidator.js';

const router = Router();

router.get('/rentals', readRental);
router.post('/rentals', rentalValidator, createRental);

export default router;