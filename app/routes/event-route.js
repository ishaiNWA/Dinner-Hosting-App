const express = require("express");
const router = express.Router();
const bookingRouter = require("./booking-route");
const { protect , authorize } = require("../middlewares/auth/index");
const { userRoles } = require("../common/user-roles");
const { validateEventSchema , validateEventBusinessRules} = require("../middlewares/validation");
const { publishEvent } = require("../controllers/events/publish-event");
const { getEvents } = require("../controllers/events/get-events");
const { filterEventsForGuests, filterEventsForHosts, applyEventQueryFilters } = require("../middlewares/event");
const { updateEventStatus } = require("../controllers/events/host/update-event-status");
const { validateRouteParams } = require("../middlewares/validation");

// Host controllers
const { getPublishedEvents } = require("../controllers/events/host/get-published-events");
const { getPublishedSingleEvent } = require("../controllers/events/host/get-published-single-event");

// Guest controllers  
const { getUpcomingEvents } = require("../controllers/events/guest/get-upcoming-events");
const { getUpcomingSingleEvent } = require("../controllers/events/guest/get-upcoming-single-event");

// Event management
router.post("/", protect, authorize([userRoles.HOST]), validateEventSchema, validateEventBusinessRules, publishEvent);
router.get("/", protect, authorize([userRoles.GUEST]), filterEventsForGuests, applyEventQueryFilters, getEvents);

// Host routes - manage published events
router.get("/published", protect, authorize([userRoles.HOST]), filterEventsForHosts, getPublishedEvents);
router.get("/published/:eventId", protect, authorize([userRoles.HOST]), validateRouteParams, getPublishedSingleEvent);
router.patch("/published/:eventId/status", protect, authorize([userRoles.HOST]), validateRouteParams, updateEventStatus);

// Guest routes - view upcoming events
router.get("/upcoming", protect, authorize([userRoles.GUEST]), getUpcomingEvents);
 router.get("/upcoming/:eventId", protect, authorize([userRoles.GUEST]), validateRouteParams, getUpcomingSingleEvent);

// re-route to booking route
router.use("/:eventId/booking", bookingRouter);

module.exports = router;