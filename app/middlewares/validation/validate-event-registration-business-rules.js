


async function validateEventRegistrationBusinessRules(req, res, next){

    const {eventId} = req.params;
    const {guestId} = req.decodedToken;

    const event = await Event.findById(eventId);
    if(!event){
        return next(new ErrorResponse(404, "Event not found"));
    }
}