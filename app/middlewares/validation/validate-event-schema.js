const { eventSchema } = require("./schemas/event-schema");
const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");


const validateEventSchema = (req, res, next) => {

    if(!req.body.eventForm){
        logger.error(`event form is required`);
        return next(new ErrorResponse(400, `event form is required`));
    }

    const { error } = eventSchema.validate(req.body,{
        stripUnknown: true,
        abortEarly
    });
    if(error){
        logger.error(`Event Validation error: ${error}`);
        return next(new ErrorResponse(400, error.message));
    }
    next();
}

module.exports = {
    validateEventSchema
}