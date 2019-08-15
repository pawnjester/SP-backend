import express from 'express';
import passport from 'passport';
import Customers from '../controllers/customersController';
import passportConfig from '../config/facebookConfig';
import  { verifyToken } from '../utils/authenticate';
import validation from '../utils/validation';
const router = express.Router();

const customer = new Customers();

router.put('/customer', verifyToken, validation.checkUserInput,customer.updateCustomer);
router.get('/customer', verifyToken, customer.getCustomerById);
router.post('/customers', customer.registerCustomer);
router.post('/customers/login', customer.loginCustomer);
router.put('/customers/address', verifyToken, validation.updateCustomer,customer.updateCustomerAddress);
router.put('/customers/creditCard', verifyToken, customer.updateCreditCard);
router.get('/customers/facebook', passport.authenticate('facebook', {scope: 'email'}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', customer.socialRedirect));


export default router;
