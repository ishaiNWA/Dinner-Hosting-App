const { ErrorResponse } = require("../../../common/errors");
const logger = require("../../../utils/logger");
const dbService = require("../../../services/db-service");

async function createEventDetailForGuest(event){

    const hostDoc = await dbService.findUserByDocId(event.hostUserId);
    
    return {
        id: event._id,
        date: event.timing.eventDate,
        location: event.location.address,
        status: event.status.current,
        hostName: hostDoc.firstName + " " + hostDoc.lastName,
        hostEmail: hostDoc.email,
        hostPhone: hostDoc.phoneNumber,
    }
}

async function getUpcomingSingleEvent(req, res, next){  
    const eventId = req.params.eventId;
    const guestId = req.decodedToken.id;

    try{

        const guestDoc = await dbService.findUserByDocId(guestId);

        if (!guestDoc) {
            return next(new ErrorResponse(404, "Guest not found"));
        }
        
        const {upcomingEvents} = guestDoc;

        const foundUpcomingEventId = upcomingEvents.find(event => event.toString() == eventId);

        if(!foundUpcomingEventId){
            return next(new ErrorResponse(404, "Event not found"));
        }

        const foundUpcomingEvent = await dbService.findEventByDocId(foundUpcomingEventId);

        if(!foundUpcomingEvent){
            return next(new ErrorResponse(404, "Event not found"));
        }

        const eventDetail = await createEventDetailForGuest(foundUpcomingEvent);

        res.status(200).json({
            success: true,
            message: "Upcoming single event fetched successfully",
            data: eventDetail
        });
    
    }catch(error){
        logger.error(`Error fetching upcoming single event: ${error}`);
        return next(new ErrorResponse(500, "Error fetching upcoming single event"));
    }
}


module.exports = {
    getUpcomingSingleEvent,
}