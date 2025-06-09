const  {ErrorResponse}  = require("../../common/errors");

/**
 * 
 * @description authorize the user to access the route
 * @param {string[]} roles - array of roles that are allowed to access the route
 * @returns {function} middleware function
 */
const authorize = (roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.decodedToken.role)){
            return next(new ErrorResponse(403, "unauthorized role"));
        }
        next();
    }
}

module.exports = {
    authorize,
}