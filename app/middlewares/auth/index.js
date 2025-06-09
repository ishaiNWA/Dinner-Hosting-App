const { googleAuthHandler } = require("./auth-handler");
const { protect } = require("./protect");
const { logout } = require("./logout");
const { authorize } = require("./authorize");

module.exports = {
  googleAuthHandler,
  protect,
  logout,
  authorize
};