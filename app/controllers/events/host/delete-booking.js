const { ErrorResponse } = require("../../../common/errors");
const logger = require("../../../utils/logger");
const dbService = require("../../../services/db-service");

async function deleteBooking(req, res, next){
    const {guestId} = req.params;
    const {eventId} = req.params;
    const hostUserId = req.decodedToken.id;

    try{
        // validate the Host-Event ownership
        const eventDoc = await dbService.findEventDoc({_id: eventId, hostUserId});
        if(!eventDoc){
            return next(new ErrorResponse(404, "Event not found"));
        }
        
       const isGuestBookedToEvent = eventDoc.bookedParticipants.some(participant => participant.guestId.toString() === guestId);
       if(!isGuestBookedToEvent){
        return next(new ErrorResponse(404, "Guest not booked to this event"));
       }

       await dbService.deleteBookedGuestFromEvent(eventId ,guestId )
       
        res.status(200).json({
            success: true,
            message: "Booking deleted successfully",
            data: {
                eventId,
                removedGuestId : guestId,
            }
        });
    }catch(error){
        logger.error(`Error in deleteBooking: ${error}`);
        return next(new ErrorResponse(500, `Unexpected internal error while deleting booking`));
    }
}

module.exports = {
    deleteBooking,
};