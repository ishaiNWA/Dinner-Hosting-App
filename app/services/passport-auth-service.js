const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const { User } = require('../models/User'); 
const env = require("../config/env");
const logger = require("../utils/logger");

passport.use(new GoogleStrategy({
  clientID: env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
  callbackURL: env.GOOGLE_OAUTH_CALLBACK_URL
}, 
async (accessToken, refreshToken, profile, done) => {
  try {
    // Get user data from Google
    const googleData = profile._json;
    logger.info(`Google OAuth: Received profile for ${googleData.email}`);

    // Check if user already exists
    let user = await User.findOne({ email: googleData.email });

    if (!user) {
      user = await User.create({
        firstName: googleData.given_name,
        lastName: googleData.family_name,
        email: googleData.email,
        authMethod: 'google',
      });
      logger.info(`Google OAuth: New user created with ID ${user._id}`);
    } else {
      logger.info(`Google OAuth: Found existing user with ID ${user._id}`);
    }

    return done(null, user);
  } catch (error) {
    logger.error(`Google OAuth: Error during authentication - ${error.message}`);
    return done(error, null);
  }
}));
