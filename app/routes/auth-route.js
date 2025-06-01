const express = require('express');
const passport = require('passport');
const router = express.Router();
const { googleAuthHandler, protect } = require("../middlewares/auth");
const { validateUser } = require("../middlewares/validation/validate-user");
const {completeProfile} = require("../middlewares/registration/complete-profile");

// Route 1: Start Google OAuth
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(`/google/callback`, googleAuthHandler);

router.post("/complete-registration", protect, validateUser, completeProfile);

module.exports = router;