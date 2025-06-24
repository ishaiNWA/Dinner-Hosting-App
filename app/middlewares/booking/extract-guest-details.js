const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");
const dbService = require("../../services/db-service");

async function extractGuestDetails(req, res, next){

    const{bookingForm} = req.body;
    const {guestId} = bookingForm;
    if(!guestId){
        return next(new ErrorResponse(400, "Guest ID is required"));
    }

    try{
    const guest = await dbService.findUserByDocId(guestId);
    if(!guest){
        return next(new ErrorResponse(404, "Guest not found"));
    }

        // Add guest details extracted from User document
    bookingForm.guestName = guest.firstName + " " + guest.lastName;
    bookingForm.guestEmail = guest.email;
    bookingForm.guestPhone = guest.phoneNumber;
        
        // Add timestamp
        bookingForm.registeredAt = new Date();

        next();
    }catch(error){
        logger.error(`Error extracting guest details: ${error}`);
        return next(new ErrorResponse(500, "Error extracting guest details"));
    }
}

module.exports = {extractGuestDetails};