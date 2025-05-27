const Joi = require("joi");
const ISRAELI_PHONE_PATTERN = /^(\+?(972)|0)?([\-\s\.])?([23489]{1}[\-\s\.]?\d{3}[\-\s\.]?\d{4}|5\d{1}[\-\s\.]?\d{3}[\-\s\.]?\d{4})$/;

const userSchema = Joi.object({
    phoneNumber: Joi.string()
        .pattern(ISRAELI_PHONE_PATTERN)
        .message("Invalid phone number")
        .required()
        .trim(),  // Add trim to clean whitespace
    address: Joi.string() //TODO: add geo location validation for address
        .required()
        .trim()
        .min(5)
        .max(200)
        .message("Address must be between 5 and 200 characters")
});

module.exports = {
    userSchema,
}