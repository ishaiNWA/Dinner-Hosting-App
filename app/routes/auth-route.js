const express = require('express');
const passport = require('passport');
const router = express.Router();
const { googleAuthHandler, protect } = require("../middlewares/auth");


// Route 1: Start Google OAuth
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(`/google/callback`, googleAuthHandler)

router.get("/complete-registration", protect, validateUser, 
);

module.exports = router;