const eventStatuses = require("../../common/event-statuses");


async function filterEventsForHosts(req, res, next){

    const params = req.query;

    //create Host filter object
    req.eventFilterObject = req.eventFilterObject || {};

    //add host user id to the filter object
    req.eventFilterObject['hostUserId'] = req.decodedToken.id;
    
    // filter by event statuses
    if(params.eventStatuses){

       for(const status of params.eventStatuses){
        if(! eventStatuses[status]){
            return next(new ErrorResponse(400, "Invalid event status"));
        }
       }
        req.eventFilterObject['status.current'] = { $in: params.eventStatuses.map(status => eventStatuses[status]) };
    }

    next();

}

module.exports = { filterEventsForHosts };

