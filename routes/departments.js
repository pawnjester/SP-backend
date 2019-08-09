import express from  'express';
import Department from '../controllers/departmentsController.js';
const router = express.Router();
import Validation from '../utils/validation';

const department = new Department();

router.get('/departments', department.getDepartment);
router.get('/departments/:department_id', Validation.departmentId,department.getDepartmentById);

export default router;
