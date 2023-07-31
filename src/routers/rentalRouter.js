import { Router } from 'express';
import { readRental, createRental, endRental } from '../controllers/rentalControllers.js';
import { rentalValidator } from '../middleware/rentalValidator.js';

const router = Router();

router.get('/rentals', readRental);
router.post('/rentals', rentalValidator, createRental);
router.post('/rentals/:id/return', endRental);

export default router;