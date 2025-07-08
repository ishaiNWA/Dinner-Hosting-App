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
  console.log(`this is the headers: ${JSON.stringify(req.headers)}`)
  if (req.cookies && req.cookies.jwt) {
    return req.cookies.jwt;
  }
  
  // Check both cases to be safe
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7); // Remove "Bearer " (7 characters)
  }
  
  return null;
}

module.exports = {
    generateJWT,
    extractRawTokenFromRequest
}


