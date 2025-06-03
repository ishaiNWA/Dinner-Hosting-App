const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blackListTokenSchema = new Schema({
    token:{
        type: String,
        required: true,
        unique: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    expires: {
        type: Date,
        required: true,
        expires: 0  // TTL index with 0 seconds offset
      }
})

const BlackListToken = mongoose.model("BlackListToken", blackListTokenSchema);

module.exports = BlackListToken;