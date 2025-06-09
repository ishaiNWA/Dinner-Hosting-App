const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");
const dbService = require("../../services/db-service");
const eventStatuses = require("../../common/event-statuses");

const validateEventBusinessRules = async (req, res, next) => {
    const hostId = req.decodedToken.id;
    const { eventForm } = req.body; 
    
    try {
        // Create date range for the same day
        const eventDate = new Date(eventForm.timing.eventDate);
        const startOfDay = new Date(eventDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(eventDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        // Build query object
        const queryObject = {
            hostUserId: hostId,
            'timing.eventDate': {
                $gte: startOfDay,
                $lt: endOfDay,
            },
            'status.current': { $ne: eventStatuses.CANCELLED }, // Don't count cancelled events
        };

        console.log(`findEventDoc with queryObject: ${JSON.stringify(queryObject)}`);

        //validate the Host has no event in the same date
        const hostDoc = await dbService.findEventDoc(queryObject);
        
        console.log(`DEBUG: Found existing event:`, hostDoc ? 'YES' : 'NO');
        if (hostDoc) {
            console.log(`DEBUG: Existing event date:`, hostDoc.timing.eventDate);
            logger.error(`Host ${hostId} already has an event scheduled for ${eventForm.timing.eventDate}`);
            return next(new ErrorResponse(400, `You already have an event scheduled for this date: ${eventDate.toDateString()}`));
        }
        
        next();
    } catch(error) {
        logger.error(`Error validating event business rules: ${error}`);
        return next(new ErrorResponse(500, 'Error validating event business rules'));
    }
}

module.exports = {
    validateEventBusinessRules
}