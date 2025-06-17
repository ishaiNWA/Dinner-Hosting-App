const express = require("express");
const router = express.Router({mergeParams: true});
const { protect , authorize } = require("../middlewares/auth/index");
const { userRoles } = require("../common/user-roles");
const { validateRegistrationSchema , validateEventRegistrationBusinessRules} = require("../middlewares/validation");
const { registerForEvent } = require("../controllers/events/register-for-event");


router.post("/", protect, authorize([userRoles.GUEST]), validateRegistrationSchema, validateEventRegistrationBusinessRules, registerForEvent);

module.exports = router;