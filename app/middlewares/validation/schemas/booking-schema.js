const Joi = require("joi");
const { dietaryRestrictionsArray } = require("../../../common/dietary-restrictions");

const BookingSchema = Joi.object({
    
    // eventId comes from URL parameter (:eventId)
    guestId: Joi.string()
        .required()
        .messages({
            'any.required': 'Guest ID is required'
        }),
        
    // Guest details (guestName, guestEmail, guestPhone) will be extracted by middleware
        
        dietaryRestrictions: Joi.array()
            .items(
                Joi.string().valid(...dietaryRestrictionsArray)
            )
            .min(1)  // At least one dietary restriction required
            .required()
            .messages({
                'array.min': 'if no dietary restrictions exist, please specify `none`',
                'any.required': 'if no dietary restrictions exist, please specify `none`',
            'any.only': 'Invalid dietary restriction. Must be one of: {#valids}'
        }),

        allergies: Joi.string()
            .max(200)
            .min(1)
        .required()
            .messages({
                'string.max': 'Allergies description cannot exceed 200 characters',
                'string.min': 'if no allergies exist, please mention it `none`',
            'any.required': 'if no allergies exist, please mention it `none`'
        }),

    plusOne: Joi.number()
        .integer()
        .min(0)
        .max(10)  // Reasonable limit
        .default(0)
            .messages({
            'number.min': 'Plus one count cannot be negative',
            'number.max': 'Plus one count cannot exceed 10',
            'number.integer': 'Plus one count must be a whole number'
    }),

    notes: Joi.string()
        .max(1000)
        .optional()
        .messages({
            'string.max': 'Notes cannot exceed 1000 characters'
        })
        
    // registeredAt will be added automatically by the system
});

module.exports = {
    BookingSchema
};