import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import connection from '../config/config.js';
import { decode } from 'punycode';

dotenv.config();
const { SECRET_KEY } = process.env;


export const generateAuthToken = ( email, name, id ) => {
  const token = jwt.sign({
    email, name, id
  }, SECRET_KEY, {
    expiresIn : 259200
  });
  return token;
}

export const hashPassword = ( password ) => {
  const salt = bcrypt.genSaltSync();
  bcrypt.hashSync(password, salt);
  return salt;
}

export const validPassword = ( password, storedPassword ) => {
  return bcrypt.compareSync(password, storedPassword )
}

export const removePassword = ( result ) => {
  const updatedResult = result[0]
  const values = Object.assign({}, updatedResult);

  delete values.password;
  return values;
}

export function verifyToken ( req, res, next ) {
  const token = req.headers['user-key'];
  if ( !token ) {
    return res.status(401).json({
      "error": {
        "status": 401,
        "code": "AUT_02",
        "message": "Access Unauthorized.",
        "field": "user-key"
      }
    });
  }
  return jwt.verify(token, SECRET_KEY, ( error, decoded) => {
    if (error) {
      return res.status(403).json({
        success: false,
        message: 'Failed to authenticate token' });
    }
    const {id, email }  = decoded;
    req.currentUserId = decoded.id
    req.currentUserEmail = email
    next()
  });
}

export function splitToken (token) {
  let splittedToken = token.split(' ')
  const newToken = splittedToken[1]
  return newToken;
}
