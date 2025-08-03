/**
 * Response formatters for consistent API responses
 * These functions ensure all controllers return data in the same format
 */

/**
 * Formats an event document for API response
 * @param {Object} eventDoc - The event document from database
 * @returns {Object} Formatted event object for client
 */
function formatEventForResponse(eventDoc) {
    const { _id, eventName, timing, status, location, dietary } = eventDoc;
    
    return {
        _id: _id,
        eventName: eventName,
        timing: {
            eventDate: timing.eventDate,
            createdAt: timing.createdAt
        },
        status: {
            current: status.current
        },
        participantCount: eventDoc.bookedParticipants ? eventDoc.bookedParticipants.length : 0,
        location: {
            address: location.address
        },
        dietary: {
            isKosher: dietary.isKosher,
            isVeganFriendly: dietary.isVeganFriendly,
            additionalOptions: dietary.additionalOptions || ""
        }
    };
}


module.exports = {
    formatEventForResponse,
}; 