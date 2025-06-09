const express = require("express");
const router = express.Router();
const { protect , authorize } = require("../middlewares/auth/index");
const { userRoles } = require("../common/user-roles");
const { validateEventSchema , validateEventBusinessRules} = require("../middlewares/validation");
const { publishEvent } = require("../controllers/events/publish-event");
const { getEvents } = require("../controllers/events/get-events");
const { filterEventsForGuests } = require("../middlewares/event");
const { applyEventQueryFilters } = require("../middlewares/event");

router.post("/",protect, authorize([userRoles.HOST]),validateEventSchema,  validateEventBusinessRules,  publishEvent);

router.get("/", protect, authorize([userRoles.GUEST]), filterEventsForGuests, applyEventQueryFilters, getEvents);

module.exports = router;