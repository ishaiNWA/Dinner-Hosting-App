const eventStatuses = require("../../common/event-statuses");
const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");


async function filterEventsForHosts(req, res, next){

    const params = req.query;

    //create Host filter object
    req.eventFilterObject = req.eventFilterObject || {};

    //add host user id to the filter object
    req.eventFilterObject['hostUserId'] = req.decodedToken.id;
    
    // filter by event statuses
    if(params.eventStatuses){
        // Convert single string to array for consistent handling
        const statusArray = Array.isArray(params.eventStatuses) ? params.eventStatuses : [params.eventStatuses];

       for(const status of statusArray){
        if(! eventStatuses[status]){
            logger.error(`Invalid event status: ${status}`);
            return next(new ErrorResponse(400, "Invalid event status"));
        }
       }
        req.eventFilterObject['status.current'] = { $in: statusArray.map(status => eventStatuses[status]) };
    }

    next();

}

module.exports = { filterEventsForHosts };

