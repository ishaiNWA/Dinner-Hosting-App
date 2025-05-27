const { userSchema } = require("./schemas/user-schemas");      
const logger = require("../../utils/logger");     

const validateUser = (req, res, next) => {
    try {
        const {error} = userSchema.validate(req.body);
        if(error){
            logger.error(`Validation error: ${error}`);
            return next(new ErrorResponse(400, error.message));
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