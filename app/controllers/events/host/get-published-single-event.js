const { ErrorResponse } = require("../../../common/errors");
const logger = require("../../../utils/logger");
const dbService = require("../../../services/db-service");

/**
 * Create detailed event view for host with participant information
 */
function createEventDetailForHost(event) {
    return {
        eventId: event._id,
        timing: {
            eventDate: event.timing.eventDate,
            createdAt: event.timing.createdAt,
            lastUpdated: event.timing.lastUpdated
        },
        location: {
            address: event.location.address
        },
        dietary: {
            isKosher: event.dietary.isKosher,
            isVeganFriendly: event.dietary.isVeganFriendly,
            additionalOptions: event.dietary.additionalOptions
        },
        status: {
            current: event.status.current,
            history: event.status.history
        },
        participants: event.bookedParticipants.map(participant => ({
            id: participant.guestId,
            name: participant.guestName,
            email: participant.guestEmail,
            phone: participant.guestPhone,
            dietaryRestrictions: participant.dietaryRestrictions,
            allergies: participant.allergies,
            plusOne: participant.plusOne,
            notes: participant.notes,
            registeredAt: participant.registeredAt
        })),
        participantCount: event.bookedParticipants.length
    };
}

async function getPublishedSingleEvent(req, res, next) {
    const eventId = req.params.eventId;
    const hostId = req.decodedToken.id;

    try {
        const eventDoc = await dbService.findEventByDocId(eventId);

        if (!eventDoc) {
            return next(new ErrorResponse(404, `Event not found with id: ${eventId}`));
        }

        // Verify the event belongs to this host
        if (eventDoc.hostUserId.toString() !== hostId) {
            return next(new ErrorResponse(403, "You can only view your own published events"));
        }

        const eventDetail = createEventDetailForHost(eventDoc);

        res.status(200).json({
            success: true,
            message: "Published event fetched successfully",
            data: eventDetail
        });
    } catch (error) {
        logger.error(`Error fetching published event: ${error}`);
        return next(new ErrorResponse(500, "Error fetching published event"));
    }
}

module.exports = {
    getPublishedSingleEvent
};