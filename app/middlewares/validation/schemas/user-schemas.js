const Joi = require("joi");
const {userRoles} = require("../../../common/user-roles");
const {dietaryRestrictionsArray} = require("../../../common/dietary-restrictions");
const ISRAELI_PHONE_PATTERN = /^(\+?(972)|0)?([\-\s\.])?([23489]{1}[\-\s\.]?\d{3}[\-\s\.]?\d{4}|5\d{1}[\-\s\.]?\d{3}[\-\s\.]?\d{4})$/;

// Shared contact info schema
const contactInfoSchema = Joi.object({
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
    contactInfo: contactInfoSchema.required()
});

// Guest-specific details schema
const guestDetailsSchema = Joi.object({
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

// Complete guest registration schema
const guestSchema = userSchema.keys({
    guestDetails: guestDetailsSchema.required()
});

// Host-specific details schema
const hostDetailsSchema = Joi.object({
    // Add host-specific validations here when needed
});

// Complete host registration schema
const hostSchema = userSchema.keys({
    hostDetails: hostDetailsSchema.required()
});

module.exports = {
    userSchema,
    guestSchema,
    hostSchema
};