import express from  'express';
import Category from '../controllers/categoriesController';
import Validation from '../utils/validation';

const router = express.Router();

const category = new Category();

router.get('/categories', category.getCategories);
router.get('/categories/:category_id', Validation.categoryId,category.getCategoryById);
router.get('/categories/inProduct/:product_id', Validation.productId,
category.getCategoriesOfProduct);
router.get('/categories/inDepartment/:department_id',Validation.departmentId,
category.getCategoriesOfDepartment);


export default router;
