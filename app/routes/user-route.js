const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { getMe } = require("../controllers/users/user-controller");
const { validateKeys } = require("../middlewares/validation/validate-keys");

router.get("/me", protect, validateKeys, getMe);

module.exports = router;