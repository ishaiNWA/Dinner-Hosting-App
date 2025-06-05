const jwt = require("jsonwebtoken");
const { extractRawTokenFromRequest } = require("../../utils/jwt");
const logger = require('../../utils/logger');
const env = require("../../config/env")
const dbService = require("../../services/db-service");
const {ErrorResponse} = require("../../common/errors");

/*****************************************************************************/

/**
 * Middleware to protect routes by verifying JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 * @throws {ErrorResponse} If token is invalid or missing
 */
const protect = async (req, res, next) => {
  const rawToken = extractRawTokenFromRequest(req);

  if (!rawToken) {
    logger.error('No token provided');
    return next(new ErrorResponse(401, 'Unauthorized'));
  }

  try{
    const blackListedTokenDoc = await dbService.findBlackListdToken(rawToken);  
  if(blackListedTokenDoc){
    logger.error('Token is blacklisted');
    console.log(`blackListedTokenDoc is : ${JSON.stringify(blackListedTokenDoc, null, 2)}`);
    return next(new ErrorResponse(401, 'Unauthorized'));
  }
  }catch(error){
    logger.error(`Error in protect middleware: ${error}`);
    return next(new ErrorResponse(500, 'Internal server error'));
  }

  try {    
    const verifiedToken = jwt.verify(rawToken, env.JWT_SECRET_KEY);

    req.decodedToken = {
        id: verifiedToken.id,
        email: verifiedToken.email,
        role: verifiedToken.role,
        exp: new Date(verifiedToken.exp * 1000)
    };
    next();
  } catch(error) {
    logger.error('Invalid token');
    return next(new ErrorResponse(401, 'Invalid token'));
  }
};

/*****************************************************************************/

module.exports = {
  protect};