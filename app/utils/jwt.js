const jwt = require("jsonwebtoken");
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
const env = require("../config/env")

/*****************************************************************************/

function generateJWT(user) {
  const id = user.id
  const email = user.email;
  const role = user.role? user.role : null;
  
  const jwtOptions = { expiresIn: ONE_DAY_IN_SECONDS };
  const token = jwt.sign({id, email, role }, env.JWT_SECRET_KEY, jwtOptions);

  return token;
}

module.exports = {
    generateJWT,
}


