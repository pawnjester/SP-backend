import mysql from 'mysql';
import dotenv from 'dotenv'
import util from 'util';

dotenv.config()

const { NODE_ENV, DB_NAME_DEV, DB_NAME_TEST, DB_PASS } = process.env

const env = NODE_ENV;

const options = {
  host: 'localhost',
  user: "root",
  password: DB_PASS,
  database: DB_NAME_DEV
}
const optionsTest = {
  host: 'localhost',
  user: "root",
  password: DB_PASS,
  database: DB_NAME_TEST
}
const choice = env === 'development' ? options : optionsTest

const connection = mysql.createPool(choice)
connection.query = util.promisify(connection.query)
export default connection;
