const express = require("express");
const router = express.Router();
const bookingRouter = require("./booking-route");
const { protect , authorize } = require("../middlewares/auth/index");
const { userRoles } = require("../common/user-roles");
const { validateEventSchema , validateEventBusinessRules} = require("../middlewares/validation");
const { publishEvent } = require("../controllers/events/publish-event");
const { getEvents } = require("../controllers/events/get-events");
const { filterEventsForGuests, filterEventsForHosts, applyEventQueryFilters } = require("../middlewares/event");
const { getPublishedEvents } = require("../controllers/events/get-published-events");



// Event management
router.post("/", protect, authorize([userRoles.HOST]), validateEventSchema, validateEventBusinessRules, publishEvent);
router.get("/", protect, authorize([userRoles.GUEST]), filterEventsForGuests, applyEventQueryFilters, getEvents);

router.get("/published", protect, authorize([userRoles.HOST]),filterEventsForHosts,  getPublishedEvents);


// re-route to booking route
router.use("/:eventId/booking", bookingRouter);

module.exports = router;