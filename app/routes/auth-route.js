const express = require('express');
const passport = require('passport');
const router = express.Router();
const { googleAuthHandler, protect, logout } = require("../middlewares/auth");
const { validateUserSchema } = require("../middlewares/validation/validate-user-schema");
const {completeProfile} = require("../middlewares/registration/complete-profile");
const { validatePlatform } = require("../middlewares/validation/validate-platform");

// Google OAuth for registration and login
router.get('/google', validatePlatform, (req, res, next) => {
  passport.authenticate('google', { 
      scope: ['profile', 'email'],
      state: req.platform  //state is a query param that is passed to the google auth handler and returned in the callback
  })(req, res, next);
});

router.get(`/google/callback`, googleAuthHandler);

router.post("/complete-registration", protect, validateUserSchema, completeProfile);

router.post("/logout", protect, logout);

module.exports = router;