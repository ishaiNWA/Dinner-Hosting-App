const express = require('express');
const passport = require('passport');
const router = express.Router();
const { googleAuthHandler, protect, logout } = require("../middlewares/auth");
const { validateUser } = require("../middlewares/validation/validate-user");
const {completeProfile} = require("../middlewares/registration/complete-profile");

// Google OAuth for registration and login
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(`/google/callback`, googleAuthHandler);

router.post("/complete-registration", protect, validateUser, completeProfile);

router.post("/logout", protect, logout);


module.exports = router;