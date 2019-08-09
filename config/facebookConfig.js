import dotenv from 'dotenv';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import passport from 'passport';
import CustomerController from '../controllers/customersController';

dotenv.config();
const {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  BACKEND_ROOT_URL } = process.env;

const socialFacebookCallback = CustomerController.socialFacebookCallback;


const facebookConfig = {
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: `${BACKEND_ROOT_URL}/auth/facebook/callback`,
  profileFields : ['id', 'emails', 'displayName']
};

const facebookStrategy = new FacebookStrategy(facebookConfig,
  socialFacebookCallback);

const config = passport.use(facebookStrategy)



export default config;
