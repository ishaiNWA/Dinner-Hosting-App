const { ErrorResponse } = require("../../../common/errors");
const logger = require("../../../utils/logger");
const dbService = require("../../../services/db-service")


function createEventSummaryForHost(event){
    return {
        id: event._id,
        date: event.timing.eventDate,
        status: event.status.current,
        participantCount: event.bookedParticipants.length,
    }
}

async function getPublishedEvents(req, res, next){

    try{

        const events = await dbService.findMultipleEvents(req.eventFilterObject);

        const eventSummaries = events.map(event => createEventSummaryForHost(event));

        res.status(200).json({
            success: true,
            message: "Published events fetched successfully",
            data: eventSummaries,
            count: eventSummaries.length,
        });
    }catch(error){
        logger.error(`Error fetching published events: ${error}`);
        return next(new ErrorResponse(500, "Error fetching published events"));
    }
}


module.exports = {
    getPublishedEvents,
}