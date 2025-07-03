const { googleAuthHandler } = require("./auth-handler");
const { protect } = require("./protect");
const { logout } = require("./logout");
const { authorize } = require("./authorize");
const { validatePlatform } = require("../validation/validate-platform");

module.exports = {
  googleAuthHandler,
  protect,
  logout,
  authorize,
  validatePlatform
};