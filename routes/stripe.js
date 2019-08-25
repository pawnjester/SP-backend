import express from 'express';
import Stripe from '../controllers/stripeController';

const router = express.Router();
const stripe = new Stripe();

router.post('/stripe/charge', stripe.createCharge);
router.post('/stripe/webhooks', stripe.provideSync);

export default router;
