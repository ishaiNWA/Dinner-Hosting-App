const passport = require('passport');
const jwt = require("../../utils/jwt");
const env = require("../../config/env")
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
const ONE_DAY_IN_MS = ONE_DAY_IN_SECONDS * 1000;
const COMPLETE_REGISTRATION_URL = 'https://example.com/complete-registration';
const DASHBOARD_URL = 'https://example.com/dashboard';
const ERROR_URL = (err) => `https://example.com/auth-error?reason=${encodeURIComponent(err)}`;
const logger = require("../../utils/logger");

async function googleAuthHandler(req, res, next) {

  const authenticator = passport.authenticate('google', async (err, user, info) => {
    if (err) {
      logger.error(`Passport authentication error: ${err}`);
      return res.redirect(ERROR_URL(err));
    }

    logger.info(`User authenticated successfully: ${user.id}`);
    

    const token = jwt.generateJWT(user);

    const cookieOptions = {
      expires: new Date(Date.now() + ONE_DAY_IN_MS),
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax' // for CSRF protection
    };

    res.cookie("jwt", token, cookieOptions);

    if (! user.isRegistrationComplete) {
      logger.info(`Redirecting new user (${user.id}) to complete registration`);
      return res.redirect(303, COMPLETE_REGISTRATION_URL);
    }

    logger.info(`Redirecting existing user (${user.id}) to dashboard`);
    return res.redirect(303, DASHBOARD_URL);
  });

  authenticator(req, res, next);
}

module.exports = {
  googleAuthHandler,
};
