const { ErrorResponse } = require("../../../common/errors");
const logger = require("../../../utils/logger");
const dbService = require("../../../services/db-service");

/**
 * Create event summary for guest list view
 */
function createUpcomingEventSummaryForGuest(event) {
    return {
        id: event._id,
        date: event.timing.eventDate,
        location: event.location.address,
        status: event.status.current,
        hostId: event.hostUserId,
        dietary: {
            isKosher: event.dietary.isKosher,
            isVeganFriendly: event.dietary.isVeganFriendly,
            additionalOptions: event.dietary.additionalOptions
        }
    };
}

async function getUpcomingEvents(req, res, next) {
    const guestId = req.decodedToken.id;

    try {
        // Find the guest user and populate their upcoming events
        const guestDoc = await dbService.findUserByDocId(guestId);
        
        if (!guestDoc) {
            return next(new ErrorResponse(404, "Guest not found"));
        }

        await guestDoc.populate("upcomingEvents");

        // Transform events to summary format
        const eventSummaries = guestDoc.upcomingEvents.map(event => 
            createUpcomingEventSummaryForGuest(event)
        );

        res.status(200).json({
            success: true,
            message: "Upcoming events fetched successfully",
            count: eventSummaries.length,
            data: eventSummaries
        });
    } catch (error) {
        logger.error(`Error fetching upcoming events: ${error}`);
        return next(new ErrorResponse(500, "Error fetching upcoming events"));
    }
}

module.exports = {
    getUpcomingEvents
};