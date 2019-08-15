import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import connection from '../config/config.js';
import  { generateAuthToken,
  validPassword,
  hashPassword, removePassword, verifyToken } from '../utils/authenticate';
import { isValidCard } from '../utils/generateId'

export default class Customers {

  /**
   * @description - Update a customer
   *
   * @param {object} req
   * @param {object} res
   */
  async updateCustomer ( req, res ) {
    try {
      const {
        name,
        email,
        day_phone,
        eve_phone,
        mob_phone } = req.body;
      const { currentUserId } = req
      const updateCustomerAddressQuery =
      `UPDATE
      customer SET
      email = ${connection.escape(email)},
      day_phone = ${day_phone},
      eve_phone = ${eve_phone},
      mob_phone = ${mob_phone},
      name = ${connection.escape(name)}
      where customer_id = ${currentUserId}`

      const updateCustomer = await connection.query(updateCustomerAddressQuery);
      const getCustomerQuery = `select * from customer where customer_id =${currentUserId}`
      const getCustomer = await connection.query(getCustomerQuery);
      const customer = removePassword(getCustomer);
      return res.status(200).json({
        customer
      });
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
   * @description - Register a Customer
   *
   * @param {object} req
   * @param {object} res
   */
  async registerCustomer (req, res ) {
    try {
      const { name, email, password } = req.body;
      const createCustomerQuery = `INSERT INTO customer SET ?`;
      const hashedPassword = hashPassword(password);
      const insertedCustomer = await connection.query(createCustomerQuery, {
        name, email, password: hashedPassword
      });
      const customerId = insertedCustomer.insertId;
      const token = generateAuthToken(email, name, customerId);
      const modifiedToken = `Bearer ${token}`
      if ( customerId !== null ) {
        const query = `select * from customer where customer_id = ${customerId}`
        const newCustomer = await connection.query(query);
        const schema = removePassword(newCustomer)
        const result = res.status(201).json({
          customer: {schema},
          accessToken : modifiedToken,
          expires_in: "24h"
        });
        return result;
      } else {
        return res.status(500).json({
          statusCode: 500, error: "Cant not find customer"
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
   * @description - Get Customer By Id
   *
   * @param {object} req
   * @param {object} res
   */
  async getCustomerById ( req, res ) {
    try {
      const { currentUserId } = req
      const getCustomerQuery =
      `select * from customer where customer_id = ${currentUserId}`;
      const customer = await connection.query(getCustomerQuery);
      const modifiedCustomer = removePassword(customer)
      const result = res.status(200).json({
        modifiedCustomer
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
   * @description - Log In Customer
   *
   * @param {object} req
   * @param {object} res
   */
  async loginCustomer ( req, res ) {
    try {
      const { email, password }  = req.body;
      const checkEmailQuery =
      `SELECT * FROM customer WHERE email= ${connection.escape(email)}`;
      try {
        const checkemail = await connection.query(checkEmailQuery);
        const checkHashedPassword = checkemail[0].password
        if ( checkemail.length == 0 ) {
          return res.status(404).json({
            message: 'Cannot be found'
          });
        }
        else if (!validPassword(password, checkHashedPassword)) {
          return res.status(400).json({
            "error": {
              "status": 400,
              "code": "USR_01",
              "message": "Email or Password is invalid.",
              "field": "Email or Password"
            }
          });
        }
        else {
          const id = checkemail[0].customer_id
          const token = generateAuthToken(email, password, id);
          const modifiedToken = `Bearer ${token}`
          const schema = removePassword(checkemail)
          const result = res.status(200).json({
            customer: {schema},
            accessToken: modifiedToken,
            expires_in: "24h"
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
   * @description - Sign In with Facebook login token
   *
   * @param {object} req
   * @param {object} res
   */
  static async socialFacebookCallback ( accessToken,
    refreshToken, profile, done ) {
    try {
      const {
        id,
        displayName,
        emails } = profile;

      const userEmail = emails[0].value
      const splitName = displayName.split(' ')
      const name = splitName[0]
      const findOrCreateQuery =
      `insert into customer (name, email)
      select
      ${connection.escape(name)},
      ${connection.escape(userEmail)}
      from customer
      where not exists
      (select email from customer
      where email=${connection.escape(userEmail)})`

      if (!userEmail) {
        const userWithNoEmail = { noEmail: true };
        return done(null, userWithNoEmail);
      }
      const findOrCreateUser = await connection.query(findOrCreateQuery);
      const customerId = findOrCreateUser.insertId;
      if (customerId !== null ) {
        const getUserQuery =
        `select * from customer
        where email = ${connection.escape(userEmail)}`
        const token = generateAuthToken(userEmail, name, customerId);
        const modifiedToken = `Bearer ${token}`
        const schema = await connection.query(getUserQuery);
        const user = {
          customer: {schema},
          accessToken: modifiedToken,
          expires_in: "24h"
        }
        return done(null, user)
      }
    } catch ( error ) {
      return error
    }
  }

  async socialRedirect ( req, res ) {
    try {
      //For the Frontend
    } catch ( error ) {
      //Frontend error
    }
  }

  /**
   * @description - Update the address from customer
   *
   * @param {object} req
   * @param {object} res
   */
  async updateCustomerAddress ( req, res ) {
    try {
      const { address_1,
        city,
        region,
        postal_code,
        country,
        shipping_region_id,
        address_2 } = req.body;
      const { currentUserId } = req;
      const shipping_id = parseInt(shipping_region_id, 10);
      const updateCustomerAddressQuery =
      `UPDATE customer
      SET address_1 = ${connection.escape(address_1)},
      city = ${connection.escape(city)},
      region = ${connection.escape(region)},
      postal_code = ${connection.escape(postal_code)},
      country = ${connection.escape(country)},
      shipping_region_id = ${connection.escape(shipping_id)}
      where customer_id = ${currentUserId}`;
      const updateCustomer = await connection.query(updateCustomerAddressQuery);
      const getCustomerQuery =
      `select * from customer
      where customer_id = ${currentUserId}`;
      const getCustomer = await connection.query(getCustomerQuery);
      const customer = removePassword(getCustomer);
      return res.status(200).json({
        customer
      });
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
   * @description - Update the credit card from customer
   *
   * @param {object} req
   * @param {object} res
   */
  async updateCreditCard ( req, res ) {
    try {
      const { credit_card } = req.body;
      const { currentUserId } = req
      const updateCreditCardQuery =
      `UPDATE
      customer SET
      credit_card= ${credit_card}
      where customer_id = ${currentUserId}`;
      if ( !credit_card ) {
        return res.status(400).json({
          "error": {
            "status": 400,
            "code": "USR_08",
            "message": "You have to put in a credit card",
            "field": "credit_card"
          }
        });
      } else if (!isValidCard(credit_card)) {
        return res.status(400).json({
          "error": {
            "status": 400,
            "code": "USR_08",
            "message": "This is an invalid Credit Card.",
            "field": "credit_card"
          }
        })
      }
      else {
        const updateCustomer = await connection.query(updateCreditCardQuery);
        const customerQuery =
        `select * from customer
        where customer_id = ${currentUserId}`
        const customer = await connection.query(customerQuery);
        const modifiedSchema = removePassword(customer)
        const result = res.status(200).json({
          customer: modifiedSchema
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
}
