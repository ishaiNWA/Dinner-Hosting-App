const passport = require('passport');
const jwt = require("../../utils/jwt");
const env = require("../../config/env");
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
const ONE_DAY_IN_MS = ONE_DAY_IN_SECONDS * 1000;

const logger = require("../../utils/logger");
const platforms = require("../../common/platforms");
const {buildMobileSuccessRedirect, buildMobileErrorRedirect} = require("../../services/auth-redirect-builder");
const {appRedirectUrls} = require("../../common/app-redirect-urls");
const googleAuthHandler = async (req, res, next) => {

  //state is a query param that is passed to the google auth handler and returned in the callback
  //this is used to determine the platform

  const authenticator = passport.authenticate('google', async function authenticationResultCallback (err, user, info){
    const platform = req.query.state;  
    if (err) {
      logger.error(`Passport authentication error: ${err}`);
      
      if (platform === platforms.WEB) {
        return res.redirect(appRedirectUrls.WEB.ERROR(err));
      } else {
        // Mobile: Redirect to app with error
        const errorRedirect = buildMobileErrorRedirect(err);
        return res.redirect(errorRedirect);
      }
    }
    logger.info(`User authenticated successfully: ${user.id}`);
    
    const token = jwt.generateJWT(user);

    if (platform === platforms.WEB) {
      const cookieOptions = {
        expires: new Date(Date.now() + ONE_DAY_IN_MS),
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' // for CSRF protection
      };

      res.cookie('jwt', token, cookieOptions);


      if (!user.isRegistrationComplete) {
        logger.info(`Redirecting new user (${user.id}) to complete registration`);
        return res.redirect(303, appRedirectUrls.WEB.COMPLETE_REGISTRATION);
      }

      //redirect to dashboard
      return res.redirect(303, appRedirectUrls.WEB.DASHBOARD);

    } else {
      // Mobile: Redirect to app with auth data
      const successRedirect = buildMobileSuccessRedirect(token, user, user.isRegistrationComplete); 
      logger.info(`Redirecting mobile user (${user.id}) to app with auth data`);
      return res.redirect(successRedirect);
    }

  });

  authenticator(req, res, next);
}

module.exports = {
  googleAuthHandler,
};




































