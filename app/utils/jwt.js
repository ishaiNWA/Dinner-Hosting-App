const jwt = require("jsonwebtoken");
const env = require("../config/env")

/*****************************************************************************/

function generateJWT(user) {
  const id = user.id 
  const email = user.email;
  const role = user.role? user.role : null;
  
  const jwtOptions = { expiresIn: '1d' }; // String format
  const token = jwt.sign({id, email, role }, env.JWT_SECRET_KEY, jwtOptions);
  
  return token;
}

function extractRawTokenFromRequest(req) {
  if (req.cookies && req.cookies.jwt) {
    return req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    const authHeader = req.headers.authorization;
    return authHeader.split("Bearer")[1].trim();
  } else {
    return null;
  }
}

module.exports = {
    generateJWT,
    extractRawTokenFromRequest
}


