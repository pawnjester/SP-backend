import connection from '../config/config.js';
import utils from '../utils/convert';


export default class Products {


  /**
   * @description - Get all Products
   *
   * @param {object} req
   * @param {object} res
   */
  async getAllProducts ( req, res ) {
    try {
      const { page, limit, description_length } = req.query;
      const pageLimit = parseInt((limit || 20), 10);
      const limitDescription = parseInt((description_length ||200), 10)
      const offset = pageLimit * (page - 1) || 0;
      const countQuery = "select count(*) as count from Product";
      const count = await connection.query(countQuery);
      const getAllProductsQuery =
      `SELECT
      product_id,
      name,
      IF(LENGTH(product.description) <= ${limitDescription},
                  product.description,
                  CONCAT(LEFT(product.description, ${limitDescription}),
                         '...')) AS description,
      price,
      discounted_price
      thumbnail FROM
      Product
      limit
      ${pageLimit}
      offset ${offset}`;
      const rows = await connection.query(getAllProductsQuery);
      const result = res.status(200).json({
        count: count[0].count,
        rows
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
   * @description - Search Products
   *
   * @param {object} req
   * @param {object} res
   *
   */
  async searchProducts ( req, res ) {
    try {
      const { query_string, all_words } = req.query
      const searchProductsQuery =
      `IF ${all_words} = "on" THEN
      PREPARE statement FROM

    ELSE
      PREPARE statement FROM

    END IF;`
    } catch ( error ) {

    }
  }

  /**
   * @description - Get Products By Id
   *
   * @param {object} req
   * @param {object} res
   */
  async getProductById (req, res ) {
    try {
      const { product_id } = req.params;
      const getProductByIdQuery = `SELECT * FROM Product WHERE product_id = ${product_id}`
      const getProductById = await connection.query(getProductByIdQuery);
      const getProduct = getProductById[0]
      const result = res.status(200).json({
        getProduct
      })
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
   * @description - Get a list of Products of Categories
   *
   * @param {object} req
   * @param {object} res
   */
  async getProductsCategories ( req, res ) {
    try {
      const  { category_id, description_length } = req.params;
      const { page, limit,  } = req.query;
      const pageLimit = parseInt((limit || 20), 10);
      const limitDescription = parseInt((description_length ||200), 10)
      const offset = pageLimit * (page - 1) || 0;
      const countQuery = `SELECT count(*) as count
      FROM product
      INNER JOIN product_category
      ON product.product_id = product_category.product_id
      WHERE product_category.category_id = ${category_id}
      ORDER BY product.product_id`
      const count = await connection.query(countQuery);
      const getProductCategoryQuery =
      `SELECT product.product_id,
      product.name,
      IF(LENGTH(product.description) <= ${limitDescription},
                  product.description,
                  CONCAT(LEFT(product.description, ${limitDescription}),
                         '...')) AS description,
      product.price,
      product.discounted_price,
      product.thumbnail
      FROM product
      INNER JOIN product_category
      ON product.product_id = product_category.product_id
      WHERE product_category.category_id = ${category_id}
      ORDER BY product.product_id limit ${pageLimit} offset ${offset}`;
      const rows = await connection.query(getProductCategoryQuery);
      const result = res.status(200).json({
        count: count[0].count,
        rows
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
   * @description - Get a list of Products on Department
   *
   * @param {object} req
   * @param {object} res
   */
  async getProductsDepartment (req, res ) {
    try  {
      const  { department_id } = req.params;
      const { page, limit, description_length } = req.query;
      const pageLimit = parseInt((limit || 20), 10);
      const limitDescription = parseInt((description_length ||200), 10)
      const offset = pageLimit * (page - 1) || 0;
      const countQuery = `select count(*) as count
      FROM product
      INNER JOIN product_category
      ON product.product_id= product_category.product_id
      INNER JOIN category
      ON product_category.category_id=category.category_id
      where category.department_id = ${department_id}`
      const count = await connection.query(countQuery);
      const getProductsDeptQuery =
      `select product.product_id,
      product.name,
      IF(LENGTH(product.description) <= ${limitDescription},
                  product.description,
                  CONCAT(LEFT(product.description, ${limitDescription}),
                         '...')) AS description,
      product.price,
      product.discounted_price, product.thumbnail
      FROM product
      INNER JOIN product_category
      ON product.product_id= product_category.product_id
      INNER JOIN category
      ON product_category.category_id=category.category_id
      where category.department_id = ${department_id}
      limit ${pageLimit} offset ${offset}`

      const rows = await connection.query(getProductsDeptQuery);
      const result = res.status(200).json({
        count: count[0].count,
        rows
      })
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
   * @description - Get Details of Product
   *
   * @param {object} req
   * @param {object} res
   */
  async getProductDetails ( req, res ) {
    try {
      const { product_id } = req.params;
      const getDetailsQuery =
      `select product_id,
      name,
      description,price,
      discounted_price,
      image,
      image_2
      from product where product_id = ${product_id}`;
      const details = await connection.query(getDetailsQuery);
      const detailsResult = details[0]
      const result = res.status(200).json({
        detailsResult
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
   * @description - Get Location Of Product
   *
   * @param {object} req
   * @param {object} res
   */
  async getLocationOfProduct ( req, res ) {
    try {
      const { product_id } = req.params;
      const getLocationOfProductQuery =
      `SELECT category.category_id,
      category.name as category_name,
      category.department_id,
      (SELECT name
        FROM department
        WHERE  department_id = category.department_id)
        AS department_name
        FROM category
        WHERE category.category_id IN
        (SELECT category_id
        FROM   product_category
        WHERE  product_id = ${product_id})`
        const getLocationOfProductResult = await connection.query(getLocationOfProductQuery);
        const getLocationOfProduct = getLocationOfProductResult[0]
        const result = res.status(200).json({
          getLocationOfProduct
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
   * @description - Get Reviews of Product
   *
   * @param {object} req
   * @param {object} res
   */
  async getReviewsOfProduct ( req, res ) {
    try {
      const  { product_id } = req.params;
      const getReviewsOfProductQuery =
      `SELECT customer.name,
      review.review,
      review.rating,
      review.created_on
      FROM review
      INNER JOIN customer
      ON customer.customer_id = review.customer_id
      WHERE review.product_id = ${product_id}
      ORDER BY review.created_on DESC`;
      const getReviews = await connection.query(getReviewsOfProductQuery);
      const result = res.status(200).json({
        getReviews
      });
      return result;
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
   * @description - Post Reviews
   *
   * @param {object } req
   * @param {object} res
   */
  async postReviews ( req, res ) {
    try {
      const { product_id } = req.params;
      const { currentUserId } = req
      const checkIfProductExistQuery =
      `SELECT * FROM Product WHERE product_id = ${product_id}`;
      const checkIfProductExist = await connection.query(checkIfProductExistQuery);
      if ( checkIfProductExist.length == 0 ) {
        return res.status(400).json({
          "status": "400",
          "message": "The field checkIfProductExist is empty.",
          "field": "checkIfProductExist",
        });
      } else {
        const { review, rating } = req.body;
        const postReviewsQuery = `INSERT into review SET ?`;
        const dateNow = utils();
        const postReview = await connection.query(postReviewsQuery, {
          review,
          rating,
          product_id,
          customer_id: currentUserId,
          created_on: dateNow
        });
        const result = res.status(200).json({
          postReview
        });
        return result;
      }
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
