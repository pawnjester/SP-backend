import connection from '../config/config.js';


export default class Tax {

  /**
   * @description - Get All Taxes
   *
   * @param {object} req
   * @param {object} res
   */
  async getAllTaxes ( req, res ) {
    try {
      const getAllTaxQuery = `SELECT * from Tax`;
      const getAllTax = await connection.query(getAllTaxQuery);
      const result = res.status(200).json({
        getAllTax
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
   * @description - Get Tax By Id
   *
   * @param {object} req
   * @param {object} res
   */
  async getTaxById ( req, res ) {
    try {
      const { tax_id } = req.params;
      const getTaxByIdQuery =
      `SELECT * FROM Tax WHERE tax_id = ${tax_id}`
      const getTaxById = await connection.query(getTaxByIdQuery);
      const result = res.status(200).json({
        getTaxById
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
}
