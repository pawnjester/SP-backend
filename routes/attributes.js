import express from  'express';
import Attribute from '../controllers/attributesController';
const router = express.Router();
import Validation from '../utils/validation'

const attribute = new Attribute();

router.get('/attributes', attribute.getAttributesList);
router.get('/attributes/:attribute_id', Validation.attributeId, attribute.getAttributeListById);
router.get('/attributes/values/:attribute_id', Validation.attributeId, attribute.getValuesAttributes);
router.get('/attributes/inProduct/:product_id',Validation.productId, attribute.getAllAttributesProductId)

export default router;
