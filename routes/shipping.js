import express from 'express';
import Shipping from '../controllers/shippingController';
import Validation from '../utils/validation';
const router = express.Router();

const shipping = new Shipping();

router.get('/shipping/regions', shipping.getShippingRegions );
router.get('/shipping/regions/:shipping_region_id',Validation.shippingId, shipping.getShippingRegionsById );

export default router;
