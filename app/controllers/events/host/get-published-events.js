const { ErrorResponse } = require("../../../common/errors");
const logger = require("../../../utils/logger");
const dbService = require("../../../services/db-service");
const { formatEventForResponse } = require("../../../utils/response-formatters");

async function getPublishedEvents(req, res, next){

    try{

        const events = await dbService.findMultipleEvents(req.eventFilterObject);

        const eventObjectsArray = events.map(event => formatEventForResponse(event));

        res.status(200).json({
            success: true,
            message: "Published events fetched successfully",
            data:{
                events: eventObjectsArray,
                count: eventObjectsArray.length,
            }
        });
    }catch(error){
        logger.error(`Error fetching published events: ${error}`);
        return next(new ErrorResponse(500, "Error fetching published events"));
    }
}

module.exports = {
    getPublishedEvents,
}