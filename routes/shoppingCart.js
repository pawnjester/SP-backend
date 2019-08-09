import express from 'express';
import ShoppingCart from '../controllers/shoppingCartController';
const router = express.Router();

const shoppingCart = new ShoppingCart();

router.post('/shoppingcart/add', shoppingCart.addProductToCart);
router.get('/shoppingcart/generateUniqueId', shoppingCart.generateCartId);
router.get('/shoppingcart/:cart_id', shoppingCart.getListOfProductsInCart);
router.put('/shoppingcart/update/:item_id', shoppingCart.updateCart);
router.delete('/shoppingcart/empty/:cart_id', shoppingCart.emptyCart);
router.get('/shoppingcart/totalAmount/:cart_id', shoppingCart.returnTotalAmount);
router.delete('/shoppingcart/removeProduct/:item_id', shoppingCart.removeProductFromCart);
router.get('/shoppingcart/getSaved/:cart_id', shoppingCart.getProductsSaved);
router.get('/shoppingcart/saveForLater/:item_id', shoppingCart.saveProductForLater);
router.get('/shoppingcart/moveToCart/:item_id', shoppingCart.moveProductInCart);

export default router;
