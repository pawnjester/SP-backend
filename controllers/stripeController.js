import Stripe from 'stripe';
import dotenv from 'dotenv';
import connection from '../config/config.js';

dotenv.config();
const { STRIPE_KEY } = process.env;

export default class StripeController {

  /**
   * @description - Receive a front-end payment and create a charge
   *
   * @param {object} req
   * @param {object} res
   */
  async createCharge (req, res, next ) {
    try {
      const stripe = Stripe(STRIPE_KEY);
      const { currentUserEmail } = req
      const {
        order_id,
        amount,
        description, stripeToken } = req.body
      const roundedAmount = Math.round(amount * 100 )
      console.log(roundedAmount)
      const createStripeCharge = await stripe.charges.create({
        amount : roundedAmount,
        currency: "usd",
        source: stripeToken,
        description,
        metadata: {
          order_id
        }});
        const result = res.status(200).json({
          createStripeCharge
        });
        return result;
    } catch ( error ) {
      return next(error)
    }
  }

  /**
   * @description - Endpoint that provide a synchronization
   *
   * @param {object} req
   * @param {object} res
   */
  async provideSync ( req, res, next ) {
    try {
      let event = JSON.parse(req.body)

    } catch ( error ) {
      return next(error)
    }
  }
}
