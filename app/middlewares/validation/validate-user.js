const { userSchema, guestSchema, hostSchema } = require("./schemas/user-schemas");      
const logger = require("../../utils/logger");     
const { ErrorResponse } = require("../../common/errors");

/**
 * Validates user registration data using a flat structure for MVP simplicity.
 * Note: If the schema grows significantly, consider refactoring to nested structure:
 * {
 *   role: "guest",
 *   contactInfo: { phone, address },
 *   guestDetails: { dietaryRestrictions, allergies }
 * }
 */
const validateUser = (req, res, next) => {
    try {
        const {error} = userSchema.validate(req.body);
        if(error){
            logger.error(`User Validation error: ${error}`);
            return next(new ErrorResponse(400, error.message));
        }
        if(req.body.role === "guest"){
            const {error} = guestSchema.validate(req.body);
            if(error){
                logger.error(`Guest Validation error: ${error}`);
                return next(new ErrorResponse(400, error.message));
            }
        } else if(req.body.role === "host"){
            const {error} = hostSchema.validate(req.body);
            if(error){
                logger.error(`Host Validation error: ${error}`);
                return next(new ErrorResponse(400, error.message));
            }
        }
        next();
    } catch (err) {
        logger.error(`Unexpected validation error: ${err}`);
        return next(new ErrorResponse(500, "Internal Server Error"));
    }
};

module.exports = {
    validateUser,
};