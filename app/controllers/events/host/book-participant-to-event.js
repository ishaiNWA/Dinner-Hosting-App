const { ErrorResponse } = require("../../../common/errors");
const logger = require("../../../utils/logger");
const dbService = require("../../../services/db-service")

async function bookParticipantToEvent(req, res, next){
    
    const {bookingForm} = req.body;
    const {guestId} = bookingForm;
    const eventId = req.params.eventId;

    try{
        const guestDoc = await dbService.findUserByDocId(guestId);
        const eventDoc = await dbService.findEventByDocId(eventId);

        await dbService.bookGuestForEvent(bookingForm, eventDoc, guestDoc);

        res.status(201).json({
            success: true,
            message: "participant booked successfully",
            data: {
                eventId,
                guestId,
            }
        })
    
    }catch(error){
        logger.error(`Error in bookParticipantToEvent: ${error.message}`, error);
        return next(new ErrorResponse(500, "unexpected internal error while booking participant to an event"));
    }
}

module.exports = {bookParticipantToEvent};