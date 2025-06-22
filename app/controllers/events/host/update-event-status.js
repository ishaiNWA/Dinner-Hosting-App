const { ErrorResponse } = require("../../../common/errors");
const logger = require("../../../utils/logger");
const dbService = require("../../../services/db-service");
const eventStatuses = require("../../../common/event-statuses");

async function updateEventStatus(req, res, next){
    const { eventId } = req.params;
    const hostUserId = req.decodedToken.id;
    const { status } = req.body;

    const validStatuses = Object.values(eventStatuses);
    if(!validStatuses.includes(status)){
        logger.error(`${status} is not a valid event status`)
        return next(new ErrorResponse(400, "Invalid event status"));
    }

    try{
        const eventDoc = await dbService.updateEventStatus({_id: eventId, hostUserId}, status);
        if(!eventDoc){
            console.log(`EVENT NOT FOUND!!`)
            return next(new ErrorResponse(404, "Event not found"));
        }

        res.status(200).json({
            success: true,
            message: "Event status updated successfully",
            data: eventDoc,
            newStatus: eventDoc.status.current
        });

    }catch(error){
        logger.error(`Error updating event status: ${error}`);
        return next(new ErrorResponse(500, "Error updating event status"));
    }
}

module.exports = {
    updateEventStatus,
}