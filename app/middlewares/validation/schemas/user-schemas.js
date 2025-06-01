const Joi = require("joi");
const {userRoles} = require("../../../common/user-roles");
const {dietaryRestrictionsArray} = require("../../../common/dietary-restrictions");
const ISRAELI_PHONE_PATTERN = /^(\+?(972)|0)?([\-\s\.])?([23489]{1}[\-\s\.]?\d{3}[\-\s\.]?\d{4}|5\d{1}[\-\s\.]?\d{3}[\-\s\.]?\d{4})$/;

// Contact details schema
const contactDetailsSchema = Joi.object({
    phoneNumber: Joi.string()
    .pattern(ISRAELI_PHONE_PATTERN)
        .message("Invalid phone number")
        .required()
        .trim(),
    address: Joi.string()
        .required()
        .trim()
        .min(5)
        .max(200)
        .message("Address must be between 5 and 200 characters")
});

// Base schema for all user types
const userSchema = Joi.object({
    role: Joi.string().valid(...Object.values(userRoles)).required(),
    roleDetails: Joi.object().required() // Will be validated by specific role schema
});

// Guest registration schema
const guestSchema = Joi.object({
    contactDetails: contactDetailsSchema.required(),
    dietaryRestrictions: Joi.array()
        .items(Joi.string().valid(...dietaryRestrictionsArray))
        .required()
        .min(1)
        .message("At least one dietary restriction must be selected (use 'none' if no restrictions)"),
    allergies: Joi.string()
        .trim()
        .allow('', 'none')
        .default('none')
});

// Host registration schema
const hostSchema = Joi.object({
    contactDetails: contactDetailsSchema.required()
    // Add more host-specific fields here as needed
});

module.exports = {
    userSchema,
    guestSchema,
    hostSchema
};