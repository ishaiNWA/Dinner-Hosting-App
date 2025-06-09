const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { getMe } = require("../controllers/users/user-controller");

router.get("/me", protect, getMe);

module.exports = router;