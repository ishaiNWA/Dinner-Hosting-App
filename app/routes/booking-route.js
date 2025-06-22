const express = require("express");
const router = express.Router({mergeParams: true});
const { protect , authorize } = require("../middlewares/auth/index");
const { userRoles } = require("../common/user-roles");
const { validateBookingSchema , validateBookingBusinessRules} = require("../middlewares/validation");
const { extractGuestDetails } = require("../middlewares/booking/extract-guest-details");
const { bookParticipantToEvent } = require("../controllers/events/host/book-participant-to-event");
const { deleteBooking } = require("../controllers/events/host/delete-booking");

router.post("/", 
    protect,
    authorize([userRoles.HOST]),
    validateBookingSchema,
    extractGuestDetails,
    validateBookingBusinessRules,
    bookParticipantToEvent,
);

router.delete("/:guestId", protect, authorize([userRoles.HOST]), deleteBooking);

module.exports = router;