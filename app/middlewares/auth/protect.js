const jwt = require("jsonwebtoken");
const logger = require('../../utils/logger');
const env = require("../../config/env")

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
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { id, email, role } = jwt.verify(token, env.JWT_SECRET_KEY);
    req.user = { id, email, role };
    next();
  } catch(error) {
    logger.error('Invalid token');
    return res.status(401).json({ message: 'Invalid token' });
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