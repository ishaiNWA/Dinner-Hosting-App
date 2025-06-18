const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");
const { eventBookingSchema } = require("./schemas/booking-schema");


function validateBookingSchema(req, res, next){

    const {bookingForm} = req.body;
    if(!bookingForm){
        return next(new ErrorResponse(400, "Booking form is required"));
    }

    const {error} = eventBookingSchema.validate(bookingForm, {
        stripUnknown: true,
        abortEarly : false
    });

    if(error){
        logger.error(`Booking Validation error: ${error}`);
        return next(new ErrorResponse(400, error.message));
    }

    next();

}

module.exports = {
    validateBookingSchema
}