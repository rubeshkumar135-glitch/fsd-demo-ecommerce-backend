import express from 'express';
import { createCheckoutSession } from '../Controllers/paymentController.js';

const router = express.Router();

// Create a checkout session for payment
router.post('/checkout', createCheckoutSession);

export default router;