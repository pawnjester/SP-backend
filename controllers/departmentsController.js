import connection from '../config/config.js';

export default class Department {

  /**
   * @description - Get Department
   *
   * @param {object} req
   * @param {object} res
   */
  async getDepartment ( req, res, next ) {
    try {
      const getDepartmentQuery = `SELECT * FROM department `;
      const getDepartment = await connection.query(getDepartmentQuery);
      const result = res.status(200).json({
        getDepartment
      })
      return result;
    } catch ( error ) {
      return next(error)
    }
  }

  /**
   * @description - Get Department by ID
   *
   * @param {object} req
   * @param {object} res
   */
  async getDepartmentById ( req, res, next ) {
    try {
      const { department_id } = req.params;
      const getDeptByIdQuery = `SELECT * FROM department WHERE department_id = ${department_id}`
      const getDeptById = await connection.query(getDeptByIdQuery);
      if (getDeptById.length == 0) {
        return res.status(404).json({
          "error" : {
            "status" : 404,
            "code": "DEP_02",
            "message": "Don'exist department with this ID.",
            "field": "department_id"
          }
        })
      }
      const result = res.status(200).json({
        getDeptById
      })
      return result
    } catch ( error ) {
      return next(error)
    }
  }
}
