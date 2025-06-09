const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");
const dbService = require("../../services/db-service")

const publishEvent = async (req, res, next) => {

    const { eventForm } = req.body;

    //preparing eventForm Structure for DB
    eventForm.hostUserId = req.decodedToken.id;

    try {
        const eventDoc = await dbService.publishEventForHostUser(eventForm.hostUserId, eventForm);

        console.log(`SUCCESS: eventDoc: ${JSON.stringify(eventDoc)}`);

        res.status(201).json({
            success: true,
            message: "Event published successfully",
            data: eventDoc
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

