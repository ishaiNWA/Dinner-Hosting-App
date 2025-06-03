const jwt = require("jsonwebtoken");
const logger = require('../../utils/logger');
const env = require("../../config/env")
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
  const token = extractToken(req);

  if (!token) {
    logger.error('No token provided');
    return next(new ErrorResponse(401, 'Unauthorized'));
  }

  try {
    const { id, email, role } = jwt.verify(token, env.JWT_SECRET_KEY);
    req.token = { id, email, role };
    next();
  } catch(error) {
    logger.error('Invalid token');
    return next(new ErrorResponse(401, 'Invalid token'));
  }
};

/*****************************************************************************/

function extractToken(req) {
    if (req.cookies && req.cookies.jwt) {
      return req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      const authHeader = req.headers.authorization;
      return authHeader.split("Bearer")[1].trim();
    } else {
      return null;
    }
  }

module.exports = protect;