import express from 'express';
import Tax from '../controllers/taxController';
import Validation from '../utils/validation'
const router = express.Router();

const tax = new Tax();

router.get('/tax', tax.getAllTaxes);
router.get('/tax/:tax_id', Validation.taxId,tax.getTaxById);

export default router;
