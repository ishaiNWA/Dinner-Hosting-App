const express = require('express');
const passport = require('passport');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-handler")


// Route 1: Start Google OAuth
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(`/google/callback`, authMiddleware.googleAuthHandler)

// router.get("complete-registration", );

module.exports = router;