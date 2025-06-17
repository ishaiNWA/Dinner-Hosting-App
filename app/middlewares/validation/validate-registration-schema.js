const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");
const { eventRegistrationSchema } = require("./schemas/event-registration-schema");


function validateRegistrationSchema(req, res, next){

    const {registrationForm} = req.body;
    if(!registrationForm){
        return next(new ErrorResponse(400, "Registration form is required"));
    }

    const {error} = eventRegistrationSchema.validate(registrationForm, {
        stripUnknown: true,
        abortEarly : false
    });

    if(error){
        logger.error(`Registration Validation error: ${error}`);
        return next(new ErrorResponse(400, error.message));
    }

    next();


}

module.exports = {
    validateRegistrationSchema
}