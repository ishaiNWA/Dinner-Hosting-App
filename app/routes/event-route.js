const express = require("express");
const router = express.Router();
const registrationRouter = require("./registration-route");
const { protect , authorize } = require("../middlewares/auth/index");
const { userRoles } = require("../common/user-roles");
const { validateEventSchema , validateEventBusinessRules} = require("../middlewares/validation");
const { publishEvent } = require("../controllers/events/publish-event");
const { getEvents } = require("../controllers/events/get-events");
const { filterEventsForGuests } = require("../middlewares/event");
const { applyEventQueryFilters } = require("../middlewares/event");



// Event management
router.post("/", protect, authorize([userRoles.HOST]), validateEventSchema, validateEventBusinessRules, publishEvent);
router.get("/", protect, authorize([userRoles.GUEST]), filterEventsForGuests, applyEventQueryFilters, getEvents);


// re-route to registration route
router.use("/:eventId/registration", registrationRouter);

module.exports = router;