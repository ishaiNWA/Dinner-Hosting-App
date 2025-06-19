const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");
const dbService = require("../../services/db-service");
const { isSameDate } = require("../../utils/helpers");

async function validateBookingBusinessRules(req, res, next){

    const {bookingForm} = req.body;
    const {guestId} = bookingForm;

    if(!guestId){
        return next(new ErrorResponse(400, "Guest ID is required"));
    }

    const eventId = req.params.eventId;

    try{
        const eventDoc = await dbService.findEventDoc({_id: eventId});

        if(!eventDoc){
            return next(new ErrorResponse(404, `Event not found with id: ${eventId}`));
        }
    
        const guestDoc = await dbService.findUserByDocId(guestId);
    
        if(!guestDoc){
            return next(new ErrorResponse(404, `Guest not found with id: ${guestId}`));
        }
    
        await guestDoc.populate("upcomingEvents");

        if(isBookedForTwoEventsSameDay(guestDoc.upcomingEvents, eventDoc)){
            return next(new ErrorResponse(400, "Guest is already booked for another event in this date"));
        }

        next();

    }catch(error){
        logger.error(`Error validating event booking business rules: ${error}`);
        return next(new ErrorResponse(500, `Error validating event booking business rules: ${error}`));
    }

}


function isBookedForTwoEventsSameDay(upcomingEvents, eventDoc){

    for(let event of upcomingEvents){
        if(isSameDate(event.timing.eventDate, eventDoc.timing.eventDate)){
            return true;
        }
    }
    return false;
}


    



module.exports = {validateBookingBusinessRules};