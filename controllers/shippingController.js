import connection from '../config/config.js';


export default class Shipping {

  /**
   * @description - Get Shipping Regions
   *
   * @param {object} req
   * @param {object} res
   */
  async getShippingRegions ( req, res, next ) {
    try {
      const getShippingRegionsQuery = `SELECT * FROM shipping_region`;
      const getShippingRegion = await connection.query(getShippingRegionsQuery);
      const result = res.status(200).json({
        getShippingRegion
      });
     return result;
    } catch ( error ) {
      return next(error)
    }
  }

  /**
   * @description - Get Shipping Regions By Id
   *
   * @param {object} req
   * @param {object} res
   */
  async getShippingRegionsById (req, res, next ) {
    try {
      const { shipping_region_id } = req.params;
      const getShippingRegionByIdQuery = `SELECT * FROM shipping WHERE shipping_region_id = ${shipping_region_id}`
      const getShippingRegById = await connection.query(getShippingRegionByIdQuery);
      const result = res.status(200).json({
        getShippingRegById
      });
      return result
    } catch ( error ) {
      return next(error)
    }
  }
}
