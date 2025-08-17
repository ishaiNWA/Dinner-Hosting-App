const passport = require('passport');
const fs = require('fs');
const path = require('path');
const jwt = require("../../utils/jwt");
const env = require("../../config/env");
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
const ONE_DAY_IN_MS = ONE_DAY_IN_SECONDS * 1000;

const logger = require("../../utils/logger");
const platforms = require("../../common/platforms");
const {buildMobileSuccessRedirect, buildMobileErrorRedirect, buildWebSuccessRedirect} = require("../../services/auth-redirect-builder");
const {appRedirectUrls} = require("../../common/app-redirect-urls");
const Handlebars = require('handlebars');
const webOauthSuccessTemplate = fs.readFileSync(path.join(__dirname, `../../views/web-platform-oauth-success.html`), 'utf8');
const webOauthSuccessTemplateCompiled = Handlebars.compile(webOauthSuccessTemplate);


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
        expires: new Date(Date.now() + ONE_DAY_IN_MS
      ),
        httpOnly: true,
        secure: true, //always true when using ngrok server
        sameSite: 'none',  // Required for cross-origin cookies
        domain: undefined  // Let browser handle domain
      };

      res.cookie('jwt', token, cookieOptions);

      // Debug cookie setting properly
      logger.info(`Setting JWT cookie for user ${user.id}`);
      logger.info(`Token: ${token}`);
      logger.info(`Cookie options: ${JSON.stringify(cookieOptions)}`);
      logger.info(`Cookie set successfully`);
      
     // const successRedirect = buildWebSuccessRedirect(user, user.isRegistrationComplete); 
      const origin = req.query.origin || env.WEB_PLATFORM_ORIGIN;
      const renderedTemplate = webOauthSuccessTemplateCompiled({
        USER_JSON: JSON.stringify(user),
        IS_REGISTRATION_COMPLETE: user.isRegistrationComplete,
        ORIGIN: origin
      }
      
    ); 

      return res.status(200).send(renderedTemplate);
        
    } else {
      // Mobile: Redirect to app with auth data
      const successRedirect = buildMobileSuccessRedirect(token, user, user.isRegistrationComplete); 
      logger.info(`Redirecting mobile user (${user.id}) to app with auth data`);
      logger.info(`Success redirect url: ${successRedirect}`);
      return res.redirect(successRedirect);
    }

  });

  authenticator(req, res, next);
}

module.exports = {
  googleAuthHandler,
};




































