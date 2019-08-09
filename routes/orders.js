import express from 'express';
import Order from '../controllers/ordersController';
import  { verifyToken } from '../utils/authenticate';

const router = express.Router();

const order = new Order();

router.post('/orders', verifyToken, order.createOrder);
router.get('/orders/:order_id', order.getInfoOrder);
router.get('/orders/inCustomer', verifyToken, order.getOrdersByCustomer);
router.get('/orders/shortDetail/:order_id', order.getShortInfoOrder);

export default router;
