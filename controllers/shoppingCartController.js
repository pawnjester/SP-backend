import connection from '../config/config.js';
import { generateId } from '../utils/generateId';
import utils from '../utils/convert';

export default class ShoppingCart {

  /**
   * @description - Generate Cart id
   * @param {object} req
   * @param {object} res
   */
  async generateCartId ( req, res ) {
    try {
      const cart_id = await generateId();
      const result = res.status(200).json({
        cart_id
      });
      return result;
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      });
    }
  }

  /**
   * @description - Add Product to Cart
   *
   * @param {object} req
   * @param {object} res
   */
  async addProductToCart ( req, res ) {

    try {
      let productQuantity;
      const { cart_id,
        product_id,
        attributes,
        quantity,
        added_on,
        buy_now } = req.body;

      const dateNow = utils();
      const checkProductQuery =
      `SELECT
      shopping_cart.item_id,
      product.product_id,
      product.name,
      shopping_cart.attributes,
      product.price,
      shopping_cart.quantity,
      product.image, (price * quantity) AS subtotal
      FROM product
      INNER JOIN shopping_cart ON
      product.product_id = shopping_cart.product_id
      WHERE product.product_id = ${connection.escape(product_id)}`;
      const getQuantityQuery =
      `SELECT quantity
      FROM   shopping_cart
      WHERE  cart_id = ${connection.escape(cart_id)}
      AND product_id = ${connection.escape(product_id)}
      AND attributes = ${connection.escape(attributes)}`
      const getQuantity = await connection.query(getQuantityQuery);
      if (getQuantity.length == 0 ) {
        const addProductQuery = `insert into shopping_cart SET ?`;
        const addProduct = await connection.query(addProductQuery, {
          cart_id,
          product_id,
          attributes,
          quantity,
          added_on: dateNow,
          buy_now
        })
        const getProducts = await connection.query(checkProductQuery);
        const result = res.status(200).json({
          getProducts
        });
      }
      else {
        const updateCartQuery = `
        UPDATE shopping_cart
        SET    quantity = quantity + 1,
        buy_now = true
        WHERE  cart_id = ${connection.escape(cart_id)}
        AND product_id = ${connection.escape(product_id)}
        AND attributes = ${connection.escape(attributes)}`
        const updateCart  = await connection.query(updateCartQuery);
        const getProducts = await connection.query(checkProductQuery);
        const result = res.status(200).json({
          getProducts
        });
      }
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      });
    }


  }

  /**
   * @description - Get List of Products
   *
   * @param {object} req
   * @param {object} res
   */
  async getListOfProductsInCart ( req, res ) {
    try {
      const { cart_id } = req.params;
      const getListFromShoppingCartQuery =
      `SELECT cart_id FROM shopping_cart
      where cart_id = ${connection.escape(cart_id)}`
      const getListFromShoppingCart =
      await connection.query(getListFromShoppingCartQuery);
      if (getListFromShoppingCart !== null ) {
        const getListOfProductsQuery =
        `select shopping_cart.item_id,
        product.product_id,
        product.name,
        shopping_cart.attributes,
        COALESCE(NULLIF(product.discounted_price, 0), product.price) AS price,
        shopping_cart.quantity,
        product.image,
        COALESCE(NULLIF(product.discounted_price, 0),
                      product.price) * shopping_cart.quantity AS subtotal
        FROM product
        INNER JOIN shopping_cart
        ON product.product_id = shopping_cart.product_id
        where shopping_cart.cart_id = ${connection.escape(cart_id)}`;
        const getListOfProducts = await
        connection.query(getListOfProductsQuery);
        const result = res.status(200).json({
          getListOfProducts
        });
        return result;
      }
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      });
    }
  }

  /**
   * @description - Update Quantity by Item Id
   *
   * @param {object} req
   * @param {object} res
   */
  async updateCart ( req, res ) {
    try {
      const { item_id } = req.params;
      const { quantity } = req.body

      const checkProductQuery = `
      select * from shopping_cart
      where item_id = ${item_id}`
      const checkProduct = await connection.query(checkProductQuery);
      if (checkProduct.length > 0) {
        const updateCartQuery =
        `UPDATE shopping_cart
        set quantity = ${quantity}
        where item_id = ${item_id}`;
        if(!quantity) {
          return res.status(400).json({
            message: 'You have to put in a quantity'
          });
        } else {
          const updatedCart = await connection.query(updateCartQuery);
          const getProductQuery =
          `select shopping_cart.item_id,
          product.name,
          shopping_cart.attributes,
          product.price,
          shopping_cart.quantity,
          product.image,
          (price * quantity) AS subtotal
          FROM product
          INNER JOIN shopping_cart
          ON product.product_id = shopping_cart.product_id
          where shopping_cart.item_id = ${item_id}`
          const getProduct = await connection.query(getProductQuery);
          const result = res.status(200).json({
            getProduct
          });
          return result;
        }
      } else {
        return res.status(400).json({
          "error": {
            "status": 400,
            "code" :"ITM_01",
            "message": "Item Id cannot be found",
            "field": "item_id"
          }
        })
      }
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      });
    }
  }

  /**
   * @description - Empty Cart
   *
   * @param {object} req
   * @param {object} res
   */
  async emptyCart ( req, res ) {
    try{
      const { cart_id } = req.params;
      const emptyCartQuery =
      `DELETE
      FROM shopping_cart
      WHERE cart_id = ${connection.escape(cart_id)}`;
      const emptyCart = await connection.query(emptyCartQuery);
      const result = res.status(200).json({
        emptyCart : []
      });
      return result;
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      });
    }
  }

  /**
   * @description - Move Product to Cart
   *
   * @param {object} req
   * @param {object} res
   */
  async moveProductInCart ( req, res ) {
    try {
      const  { item_id } = req.params;
      const id = parseInt(item_id, 10);
      const checkIfProductQuery =
      `select * from
      shopping_cart
      where item_id=${connection.escape(item_id)}`
      const checkIfProductExists = await connection.query(checkIfProductQuery);
      if (checkIfProductExists.length > 0 ) {
        const moveProductQuery =
        `UPDATE shopping_cart
        SET buy_now = true,
        added_on = NOW()
        WHERE item_id = ${item_id}`
        const moveProduct = await connection.query(moveProductQuery);
        const result = res.status(200).json({
          moveProduct
        });
        return result
      } else {
        return res.status(400).json({
          "error": {
            "status": 400,
            "code" :"ITM_01",
            "message": "Item Id cannot be found",
            "field": "item_id"
          }
        })
      }
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      });
    }
  }

  /**
   * @description - Return Total Amount
   *
   * @param {object} req
   * @param {object} res
   */
  async returnTotalAmount ( req, res ) {
    try {
      const { cart_id } = req.params;
      const checkIfProductExistsQuery =
      `select * from shopping_cart
      where cart_id = ${connection.escape(cart_id)}`;
      const checkIfProductExists = await connection.query(checkIfProductExistsQuery);
      if (checkIfProductExists.length > 0 ) {
        const totalAmountQuery =
        `select
        SUM(COALESCE(NULLIF(p.discounted_price, 0), p.price)
        * sc.quantity) AS total_amount
        FROM shopping_cart sc
        INNER JOIN product p
        ON sc.product_id = p.product_id
        WHERE sc.cart_id = ${connection.escape(cart_id)}
        AND sc.buy_now;`
        const totalAmount =
        await connection.query(totalAmountQuery);
        const result = res.status(200).json({
          totalAmount
        });
        return result;
      } else {
        return res.status(400).json({
          "error": {
            "status": 400,
            "code" :"CAR_01",
            "message": "Cart Id cannot be found",
            "field": "cart_id"
          }
        })
      }
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      });
    }
  }

  /**
   * @description - Save Product For Latter
   *
   * @param {object} req
   * @param {object} res
   */
  async saveProductForLater ( req, res ) {
    try {
      const  { item_id } = req.params;
      const checkIfProductExistsQuery = `select * from shopping_cart where item_id = ${connection.escape(item_id)}`;
      const checkIfProductExists = await connection.query(checkIfProductExistsQuery);
      if (checkIfProductExists.length > 0 ) {
        const saveProductQuery =
        `UPDATE shopping_cart
        SET buy_now = false
        WHERE item_id = ${item_id}`
        const saveProductForLater = await connection.query(saveProductQuery);
        const result = res.status(200).json({
          saveProductForLater
        });
        return result;
      } else {
        return res.status(400).json({
          "error": {
            "status": 400,
            "code" :"ITM_01",
            "message": "Item Id cannot be found",
            "field": "item_id"
          }
        })
      }
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      });
    }
  }

  /**
   * @description - Get Products Saved For Latter
   *
   * @param {object} req
   * @param {object} res
   */
  async getProductsSaved ( req, res ) {
    try {
      const { cart_id } = req.params;
      const getProductsQuery =
      `Select
      shopping_cart.item_id,
      product.name,
      shopping_cart.attributes,
      COALESCE(NULLIF(product.discounted_price, 0), product.price) AS price
      FROM shopping_cart
      INNER JOIN product
      ON shopping_cart.product_id = product.product_id
      WHERE shopping_cart.cart_id = ${connection.escape(cart_id)}
      AND NOT shopping_cart.buy_now`;
      const getProducts = await connection.query(getProductsQuery);
      const result = res.status(200).json({
        getProducts
      });
      return result
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      });
    }
  }

  /**
   * @description - Remove a product in the Cart
   *
   * @param {object} req
   * @param {object} res
   */
  async removeProductFromCart ( req, res ) {
    try {
      const { item_id } = req.params;
      const removeProductQuery =
      `DELETE FROM shopping_cart
      WHERE item_id = ${connection.escape(item_id)} `
      const removeProduct = await connection.query(removeProductQuery);
      const result = res.status(200).json({
        removeProduct
      });
      return result;
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      });
    }
  }
}
