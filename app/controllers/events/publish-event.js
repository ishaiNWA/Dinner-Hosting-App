const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");
const dbService = require("../../services/db-service")


function buildResponseEventObject(publishedEventDoc){
    const {_id, eventName, timing, status, participantCount, location, dietary} = publishedEventDoc;
    return {
    "_id": _id,
    "eventName": eventName,
    "timing": {
      "eventDate": timing.eventDate,
      "createdAt": timing.createdAt
    },
    "status": {
      "current": status.current
    },
    "participantCount": 0,
    "location": {
      "address": location.address
    },
    "dietary": {
      "isKosher": dietary.isKosher,
      "isVeganFriendly": dietary.isVeganFriendly,
      "additionalOptions": dietary.additionalOptions? dietary.additionalOptions : ""
    }
} 
}

const publishEvent = async (req, res, next) => {

    const { eventForm } = req.body;

    //preparing eventForm Structure for DB
    eventForm.hostUserId = req.decodedToken.id;

    try {
        const eventDoc = await dbService.publishEventForHostUser(eventForm.hostUserId, eventForm);

        console.log(`SUCCESS: eventDoc: ${JSON.stringify(eventDoc)}`);
 
        let eventObject = buildResponseEventObject(eventDoc);

        res.status(201).json({
            success: true,
            message: "Event published successfully",
            data: {
                event: eventObject
            }
        });
    } catch (error) {
        console.log(`error in publishEvent: ${error}`);
        logger.error(`Error publishing event: ${error}`);
        return next(new ErrorResponse(500, 'Error publishing event'));
    }
}

module.exports = {
    publishEvent
}

