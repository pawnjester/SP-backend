import connection from '../config/config.js';

export default class Categories {

  /**
   * @description - Get Categories
   *
   * @param {object} req
   * @param {object} res
   */
  async getCategories ( req, res, next ) {
    try {
      const { order, page, limit } = req.query;
      const pageLimit = parseInt((limit || 20), 10);
      const offset = pageLimit * (page - 1) || 0;
      const countQuery = "select count(*) as count from category";
      const count = await connection.query(countQuery);
      const sortedOrder = order === "category_id" || order === "name" ? order : "category_id"
      const getCategoriesQuery =
      `SELECT category_id,name,description, department_id
      FROM category
      ORDER BY ${sortedOrder} DESC limit ${pageLimit} offset ${offset}`;
      const rows = await connection.query(getCategoriesQuery);
      const result = res.status(200).json({
        count: count[0].count,
        rows
      })
      return result;
    } catch ( error ) {
      return next(error)
    }
  }

  /**
   * @description - Get Category By ID
   *
   * @param {object} req
   * @param {object} res
   */
  async getCategoryById ( req, res, next ) {
    try {
      const { category_id } = req.params;
      const getCategoryByIdQuery =
      `SELECT category_id, name, description, department_id
      FROM category WHERE category_id = ${category_id}`
      const getCategoryByIdResult = await connection.query(getCategoryByIdQuery);
      const getCategoryById = getCategoryByIdResult[0]
      const result = res.status(200).json({
        getCategoryById
      })
      return result
    } catch ( error ) {
      return next(error)
    }
  }

  /**
   * @description - Get Categories Of Product
   *
   * @param {object} req
   * @param {object} res
   */
  async getCategoriesOfProduct ( req, res, next ) {
    try {
      const { product_id } = req.params;
      const getCategoriesOfProductQuery =
      `SELECT product_category.category_id,
      category.category_id,
      category.name,
      category.department_id
      FROM
      product_category
      INNER JOIN category
      ON product_category.category_id=category.category_id
      WHERE product_id = ${product_id}`
      const getCategoriesOfProduct = await connection.query(getCategoriesOfProductQuery);
      const result = res.status(200).json({
        getCategoriesOfProduct
      })
      return result
    } catch ( error ) {
      return next(error)
    }
  }

  /**
   * @description - Get Categories of Department
   *
   * @param {object} req
   * @param {object} res
   */
  async getCategoriesOfDepartment ( req, res, next ) {
    try {
    const { department_id } = req.params;
    const getCategoriesOfDeptQuery =
    `SELECT * FROM category
    WHERE department_id = ${department_id}`
    const getCategoriesOfDept = await connection.query(getCategoriesOfDeptQuery);
    const result = res.status(200).json({
      getCategoriesOfDept
    })
    return result
  } catch ( error ) {
    return next(error)
  }
  }
}
