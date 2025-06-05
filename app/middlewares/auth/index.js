const { googleAuthHandler } = require("./auth-handler");
const { protect } = require("./protect");
const { logout } = require("./logout");

module.exports = {
  googleAuthHandler,
  protect,
  logout
};