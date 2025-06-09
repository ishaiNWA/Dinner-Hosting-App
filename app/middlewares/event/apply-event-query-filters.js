const { ErrorResponse } = require("../../common/errors");

function applyEventQueryFilters(req ,res, next){

    req.eventFilterObject = req.eventFilterObject || {};

    const {isKosher, isVeganFriendly, eventDate} = req.query;
    
    try {
        if(isKosher !== undefined){
            req.eventFilterObject['dietary.isKosher'] = isKosher == 'true';
        }
        if(isVeganFriendly !== undefined){
            req.eventFilterObject['dietary.isVeganFriendly'] = isVeganFriendly == 'true';
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