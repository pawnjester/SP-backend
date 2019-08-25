import connection from '../config/config.js';


export default class Attributes {

  /**
   * @description - Get Attribute List
   *
   * @param {object} req
   * @param {object} res
   */
  async getAttributesList (req, res, next ) {
    try {
      const getAttributeQuery =
      `SELECT
      attribute_id,
      name
      FROM Attribute`;
      const getAttributeList = await connection.query(getAttributeQuery);
      const result = res.status(200).json({
        getAttributeList
      });
      return result;
    } catch ( error ) {
      return next(error)
    }
  }

  /**
   * @description - Get Attribute List By Id
   *
   * @param {object} req
   * @param {object} res
   */
  async getAttributeListById ( req, res, next ) {
    try {
      const { attribute_id } = req.params;
      const getAttributeByIdQuery = `SELECT attribute_id, name FROM Attribute
      WHERE attribute_id = ${attribute_id}`
      const getAttributeById = await connection.query(getAttributeByIdQuery);
      const result = res.status(200).json({
        getAttributeById
      });
      return result
    } catch ( error ) {
      return next(error)
    }
  }

  /**
   * @description - Get Value Attributes
   *
   * @param {object} req
   * @param {object} res
   */
  async getValuesAttributes ( req, res, next ) {
    try {
      const { attribute_id } = req.params;
      const getAttributeValueByIdQuery =
      `SELECT
      attribute_value_id,
      value
      FROM attribute_value
      WHERE attribute_id = ${attribute_id}`
      const getAttributeValueById =
      await connection.query(getAttributeValueByIdQuery);
      const result = res.status(200).json({
        getAttributeValueById
      })
      return result
    } catch ( error ) {
      return next(error)
    }
  }

  /**
   * @description - Get all Attributes with Product ID
   *
   * @param {object} req
   * @param {object} res
   */
  async getAllAttributesProductId ( req, res, next ) {
    try {
      const  { product_id } = req.params;
      const getAllAttributesProductIdQuery =
      `SELECT
       attribute.name AS attribute_name,
       attribute_value.attribute_value_id,
       attribute_value.value AS attribute_value
       FROM       attribute_value
       INNER JOIN attribute
       ON attribute_value.attribute_id = attribute.attribute_id
       WHERE      attribute_value.attribute_value_id IN
       (SELECT attribute_value_id
        FROM   product_attribute
        WHERE  product_id = ${product_id})
        ORDER BY   attribute.name`
        const getAllAttributesProduct =
        await connection.query(getAllAttributesProductIdQuery);
        const result = res.status(200).json({
          getAllAttributesProduct
        });
        return result;
      } catch ( error ) {
        console.log(error)
        return next(error)
      }
  }
}
