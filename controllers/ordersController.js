import connection from '../config/config.js';
import utils from '../utils/convert';


export default class Orders {

  /**
   * @description - Create an order
   *
   * @param {object} req
   * @param {object} res
   */
  async createOrder ( req, res ) {
    try {
      const  { cart_id, shipping_id, tax_id } = req.body;
      const { currentUserId } = req
      const dateNow = utils();
      const createOrderQuery = `INSERT INTO orders SET ?`;
      const orderCreated = await connection.query(createOrderQuery, {
        created_on: dateNow,
        customer_id: currentUserId,
        shipping_id,
        tax_id
      });
      const orderId = orderCreated.insertId
      console.log(orderId)
      const insertOrderDetailQuery =
      `INSERT INTO order_detail (order_id, product_id, attributes,
      product_name, quantity, unit_cost)
      SELECT      12, p.product_id, sc.attributes, p.name, sc.quantity,
      COALESCE(NULLIF(p.discounted_price, 0), p.price) AS unit_cost
      FROM        shopping_cart sc
      INNER JOIN  product p
      ON sc.product_id = p.product_id
      WHERE sc.cart_id = ${connection.escape(cart_id)}
      AND sc.buy_now`;
      const orderDetail = await connection.query(insertOrderDetailQuery);
      // const updateOrdersQuery =
      // `UPDATE orders
      // SET total_amount = (SELECT SUM(unit_cost * quantity)
      //                        FROM   order_detail
      //                        WHERE  order_id = ${connection.escape(orderId)})
      // WHERE  order_id = ${connection.escape(orderId)}`;
      // const updateOrders = connection.query(updateOrdersQuery);
      // const emptyCartQuery =
      // `DELETE FROM shopping_cart
      // WHERE cart_id = ${connection.escape(cart_id)}`;
      // const emptyCart = connection.query(emptyCartQuery);
      const result = res.status(201).json({
        orderCreated
      });
      return result;
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      })
    }
  }

  /**
   * @description - Get Info about Order
   *
   * @param {object} req
   * @param {object} res
   */
  async getInfoOrder ( req, res ) {
    try {
      const { order_id } = req.params;
      const getInfoOrderQuery =
      `SELECT order_id, product_id,
      attributes,
      product_name,
      quantity,
      unit_cost,
      quanity * unit_cost as subtotal
      FROM order_detail
      where order_id = ${connection.escape(order_id)}`
      const getInfo = await connection.query(getInfoOrderQuery);
      const result = res.status(200).json({
        getInfo
      });
      return result
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      })
    }
  }

  /**
   * @description - get Orders by Customer
   *
   * @param {object} req
   * @param {object} res
   */
  async getOrdersByCustomer ( req, res ) {
    try {
      const { currentUserId } = req;
      const getOrdersByCustomerQuery =
      `SELECT
      orders.order_id,
      orders.total_amount,
      orders.created_on,
      orders.shipped_on,
      orders.status,
      customer.name
      FROM orders
      INNER JOIN customer
      ON orders.customer_id = customer.customer_id
      WHERE orders.customer_id = ${currentUserId}`
      const getOrdersByCustomer = await connection.query(getOrdersByCustomerQuery);
      const result = res.status(200).json({
        getOrdersByCustomer
      });
      return result;
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      })
    }
  }

  /**
   * @description - Get Info about Order -shortDetail
   *
   * @param {object} req
   * @param {object} res
   */
  async getShortInfoOrder ( req, res ) {
    try {
      const  { order_id } = req.params;
      const getShortInfoQuery =
      `SELECT
      orders.order_id,
      orders.total_amount,
      orders.created_on,
      orders.shipped_on,
      orders.status,
      customer.name
      FROM orders
      INNER JOIN customer
      ON orders.customer_id = customer.customer_id
      WHERE orders.order_id = ${order_id}`
      const getShortInfo = await connection.query(getShortInfoQuery);
      const result = res.status(200).json({
        getShortInfo
      });
      return result;
    } catch ( error ) {
      return res.status(500).json({
        "error": {
          "status": 500,
          "message": error.message,
        }
      })
    }
  }
}
