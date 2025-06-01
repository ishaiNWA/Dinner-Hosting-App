const { userSchema, guestSchema, hostSchema } = require("./schemas/user-schemas");      
const logger = require("../../utils/logger");     
const { ErrorResponse } = require("../../common/errors");

/**
 * Validates user registration data using a nested structure for better organization:
 * {
 *   role: "guest",
 *   roleDetails: {
 *     contactDetails: { phoneNumber, address },
 *     dietaryRestrictions: [...],  // for guests
 *     allergies: "none"            // for guests
 *   }
 * }
 */
const validateUser = (req, res, next) => {
    try {
        const {userDataForm}= req.body;
        // Validate basic structure and role
        const {error} = userSchema.validate(userDataForm);
        if(error){
            logger.error(`User Validation error: ${error}`);
            return next(new ErrorResponse(400, error.message));
        }

        // Validate role-specific data
        if(userDataForm.role === "guest"){
            const {error} = guestSchema.validate(userDataForm.roleDetails);
            if(error){
                logger.error(`Guest Validation error: ${error}`);
                return next(new ErrorResponse(400, error.message));
            }   
        } else if(user.role === "host"){
            const {error} = hostSchema.validate(user.roleDetails);
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