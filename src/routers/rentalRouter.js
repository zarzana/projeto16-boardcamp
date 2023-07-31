import { Router } from 'express';
import { readRental, createRental, endRental, deleteRental } from '../controllers/rentalControllers.js';
import { rentalValidator } from '../middleware/rentalValidator.js';

const router = Router();

router.get('/rentals', readRental);
router.post('/rentals', rentalValidator, createRental);
router.post('/rentals/:id/return', endRental);
router.delete('/rentals/:id', deleteRental)

export default router;