import connection from '../config/config.js';
import utils from '../utils/convert';


export default class Orders {

  /**
   * @description - Create an order
   *
   * @param {object} req
   * @param {object} res
   */
  async createOrder ( req, res, next ) {
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
      const insertOrderDetailQuery =
      `INSERT INTO order_detail (order_id, product_id, attributes,
      product_name, quantity, unit_cost)
      SELECT  ${orderId},
      p.product_id,
      sc.attributes,
      p.name,
      sc.quantity,
      COALESCE(NULLIF(p.discounted_price, 0), p.price) AS unit_cost
      FROM  shopping_cart sc
      INNER JOIN  product p
      ON sc.product_id = p.product_id
      WHERE sc.cart_id = ${connection.escape(cart_id)}
      AND sc.buy_now`;
      const orderDetail = await connection.query(insertOrderDetailQuery);
      console.log(orderDetail)
      const updateOrdersQuery =
      `UPDATE orders
      SET total_amount = (SELECT SUM(unit_cost * quantity)
                             FROM   order_detail
                             WHERE  order_id = ${connection.escape(orderId)})
      WHERE  order_id = ${connection.escape(orderId)}`;
      const updateOrders = connection.query(updateOrdersQuery);
      const emptyCartQuery =
      `DELETE FROM shopping_cart
      WHERE cart_id = ${connection.escape(cart_id)}`;
      const emptyCart = connection.query(emptyCartQuery);
      const result = res.status(201).json({
        orderId
      });
      return result;
    } catch ( error ) {
      return next(error)
    }
  }

  /**
   * @description - Get Info about Order
   *
   * @param {object} req
   * @param {object} res
   */
  async getInfoOrder ( req, res, next ) {
    try {
      const { order_id } = req.params;
      const getInfoOrderQuery =
      `SELECT
      order_id,
      product_id,
      attributes,
      product_name,
      quantity,
      unit_cost,
      (quantity * unit_cost) AS subtotal
      FROM order_detail
      where order_id = ${connection.escape(order_id)}`
      const getInfo = await connection.query(getInfoOrderQuery);
      const result = res.status(200).json({
        getInfo
      });
      return result
    } catch ( error ) {
      console.log(error)
      return next(error)
    }
  }

  /**
   * @description - get Orders by Customer
   *
   * @param {object} req
   * @param {object} res
   */
  async getOrdersByCustomer ( req, res, next ) {
    try {
      const { currentUserId } = req;
      console.log(currentUserId)
      const getOrdersByCustomerQuery =
      `SELECT
      customer.name,
      orders.order_id,
      orders.total_amount,
      orders.created_on,
      orders.shipped_on,
      orders.status
      FROM orders
      INNER JOIN customer
      ON orders.customer_id = customer.customer_id
      WHERE orders.customer_id = ${currentUserId}`
      const getOrdersByCustomer =
      await connection.query(getOrdersByCustomerQuery);
      const result = res.status(200).json({
        getOrdersByCustomer
      });
      return result;
    } catch ( error ) {
      return next(error)
    }
  }

  /**
   * @description - Get Info about Order -shortDetail
   *
   * @param {object} req
   * @param {object} res
   */
  async getShortInfoOrder ( req, res, next ) {
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
      return next(error)
    }
  }
}
