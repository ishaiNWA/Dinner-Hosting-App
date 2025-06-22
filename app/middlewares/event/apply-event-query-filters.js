const { ErrorResponse } = require("../../common/errors");

/**
 * @description this function allows to build the eventFilterObject
 */
function applyEventQueryFilters(req ,res, next){

    req.eventFilterObject = req.eventFilterObject || {};

    const {isKosher, isVeganFriendly, eventDate} = req.query;
    
    try {
        if(isKosher !== undefined){
            if(!['true', 'false'].includes(isKosher)) {
                return next(new ErrorResponse(400, "isKosher must be 'true' or 'false'"));
            }
            req.eventFilterObject['dietary.isKosher'] = isKosher;
        }

        if(isVeganFriendly !== undefined){
            if(!['true', 'false'].includes(isVeganFriendly)) {
                return next(new ErrorResponse(400, "isVeganFriendly must be 'true' or 'false'"));
            }
            req.eventFilterObject['dietary.isVeganFriendly'] = isVeganFriendly;
        }
        if(eventDate !== undefined){
            const date = new Date(eventDate);
            if(isNaN(date.getTime())){
                return next(new ErrorResponse(400, "Invalid date format"));
            }

            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);  
            endOfDay.setHours(23, 59, 59, 999);
            
            req.eventFilterObject['timing.eventDate'] = {
                $gte: startOfDay,
                $lte: endOfDay
            };
        }

        next();
    } catch (error) {
        return next(new ErrorResponse(500, "Error applying event query filters"));
    }
}

module.exports = {
    applyEventQueryFilters
}