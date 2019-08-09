import express from  'express';
import Product from '../controllers/productsController';
const router = express.Router();
import Validation from '../utils/validation';
import  { verifyToken } from '../utils/authenticate';

const product = new Product();


router.get('/products', product.getAllProducts);
router.get('/products/:product_id', product.getProductById);
router.get('/products/:product_id/details', Validation.productId,product.getProductDetails);
router.post('/products/:product_id/reviews', verifyToken ,Validation.productId, product.postReviews);
router.get('/products/:product_id/reviews', Validation.productId, product.getReviewsOfProduct);
router.get('/products/inCategory/:category_id', Validation.categoryId, product.getProductsCategories);
router.get('/products/:product_id/locations', Validation.productId, product.getLocationOfProduct);
router.get('/products/inDepartment/:department_id', Validation.departmentId, product.getProductsDepartment);
router.get('/products/search', product.searchProducts);

export default router;
