const eventStatuses = require("../../common/event-statuses");


function filterEventsForGuests(req, res, next){

    req.eventFilterObject = req.eventFilterObject || {};

    req.eventFilterObject.status = {
        current : eventStatuses.OPEN_FOR_REGISTRATION,
    }

    next();
    }

module.exports = {
filterEventsForGuests,
}