const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");
const dbService = require("../../services/db-service")

/**
 * Filter event data for guest list view
 * Only return information guests need for browsing/decision making
 */
function createEventSummaryForClient(event) {
    return {
        id: event._id,
        timing: {
            eventDate: event.timing.eventDate,
            createdAt: event.timing.createdAt
        },
        location: {
            address: event.location.address
        },
        dietary: {
            isKosher: event.dietary.isKosher,
            isVeganFriendly: event.dietary.isVeganFriendly,
            additionalOptions: event.dietary.additionalOptions
        },
        // Basic host info (no personal details)
        host: {
            id: event.hostUserId,
            // In future: firstName only, or host display name
        }
    };
}

async function getEvents(req, res, next){

    req.eventFilterObject = req.eventFilterObject || {};

    try{
  
        const events = await dbService.findMultipleEvents(req.eventFilterObject);
        // Transform events to summary format
        const eventSummaries = events.map(event => createEventSummaryForClient(event));
        
        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            count: eventSummaries.length,
            data: eventSummaries
        });
    }catch(error){
        logger.error(`Error fetching events: ${error}`);
        return next(new ErrorResponse(500, "Error fetching events"));
    }
}

module.exports = {
    getEvents,
}