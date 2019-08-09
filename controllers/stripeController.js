import Stripe from 'stripe';
import dotenv from 'dotenv';
import connection from '../config/config.js';

dotenv.config();
const { STRIPE_KEY } = process.env;

export default class StripeController {

  /**
   * @description - Receive a front-end payment and create a charge
   * @param {object} req
   * @param {object} res
   */
  async createCharge (req, res ) {
    try {
      const stripe = Stripe('sk_test_lomdOfxbm7QDgZWvR82UhV6D');
      const { currentUserEmail } = req
      const {
        order_id,
        amount,
        description } = req.body
      const createStripeCharge = await stripe.charges.create({
        amount,
        currency: "usd",
        source: 'tok_mastercard',
        description,
        metadata: {
          order_id
        }});
        const result = res.status(200).json({
          createStripeCharge
        });
        return result;
    } catch ( error ) {
      console.log(error)
    }
  }

  /**
   * @description - Endpoint that provide a synchronization
   * @param {object} req
   * @param {object} res
   */
  async provideSync ( req, res ) {
    try {

    } catch ( error ) {

    }
  }
}
