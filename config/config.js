import mysql from 'mysql';
import dotenv from 'dotenv'
import util from 'util';

dotenv.config()

const { NODE_ENV, DB_NAME_DEV, DB_NAME_TEST, DB_PASS } = process.env

const env = NODE_ENV;
const url = 'mysql://b55c15de5ce62e:f47b5618@us-cdbr-iron-east-02.cleardb.net/heroku_f593a1d0fc622f8?reconnect=true'

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


const production = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }

const choice = env === 'development' ? options : optionsTest

const connection = mysql.createPool(choice)
connection.query = util.promisify(connection.query)
export default connection;
