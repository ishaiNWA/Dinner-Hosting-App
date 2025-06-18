const express = require("express");
const router = express.Router({mergeParams: true});
const { protect , authorize } = require("../middlewares/auth/index");
const { userRoles } = require("../common/user-roles");
const { validateBookingSchema , validateBookingBusinessRules} = require("../middlewares/validation");
const { extractGuestDetails } = require("../middlewares/booking/extract-guest-details");
const { bookParticipantToEvent } = require("../controllers/events/book-participant-to-event");


router.post("/", 
    protect,
    authorize([userRoles.HOST]),
    validateBookingSchema,
    extractGuestDetails,
    validateBookingBusinessRules,
    bookParticipantToEvent,
);

module.exports = router;