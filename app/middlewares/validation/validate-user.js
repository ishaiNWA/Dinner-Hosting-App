const { userSchema, guestSchema, hostSchema } = require("./schemas/user-schemas");      
const logger = require("../../utils/logger");     
const { ErrorResponse } = require("../../common/errors");
const { userRoles } = require("../../common/user-roles");

/**
 * Validates user registration data using a nested structure for better organization:
 * userDataForm: {
 *   role: [Guest, Host],
 *   roleDetails: {
 *     contactDetails: { phoneNumber, address ... },
 *     role specific fields // for guests
 *   }
 * }
 */
const validateUser = (req, res, next) => {
    try {
        if(! req.body.userDataForm){
            return next(new ErrorResponse(400, "User data form is required"));
        }
        const userDataForm = req.body.userDataForm;
       
        // Validate basic structure and role
        const {error} = userSchema.validate(userDataForm);
        if(error){
            logger.error(`User Validation error: ${error}`);
            return next(new ErrorResponse(400, error.message));
        }

        // Validate role-specific data
        if(userDataForm.role === userRoles.GUEST){
            const {error} = guestSchema.validate(userDataForm.roleDetails);
            if(error){
                logger.error(`Guest Validation error: ${error}`);
                return next(new ErrorResponse(400, error.message));
            }   
        } else if(userDataForm.role === userRoles.HOST){
            const {error} = hostSchema.validate(userDataForm.roleDetails);
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