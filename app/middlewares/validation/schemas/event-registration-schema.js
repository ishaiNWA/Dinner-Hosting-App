const Joi = require("joi");
const { dietaryRestrictionsArray } = require("../../../common/dietary-restrictions");

const eventRegistrationSchema = Joi.object({
    // Client sends only these fields:
    // - eventId comes from URL parameter (:id)
    // - guestId comes from auth token (req.decodedToken.id)
    // - status is auto-generated (not from client)
    
    numberOfGuests: Joi.number()
        .integer()
        .min(1)
        .max(10)  // Reasonable limit
        .optional()  // Has default value of 1
        .messages({
            'number.min': 'Number of guests must be at least 1',
            'number.max': 'Number of guests cannot exceed 10',
            'number.integer': 'Number of guests must be a whole number'
        }),

    dietary: Joi.object({
        dietaryRestrictions: Joi.array()
            .items(
                Joi.string().valid(...dietaryRestrictionsArray)
            )
            .min(1)  // At least one dietary restriction required
            .required()
            .messages({
                'array.min': 'if no dietary restrictions exist, please specify `none`',
                'any.required': 'if no dietary restrictions exist, please specify `none`',
                'any.only': 'Invalid dietary restriction. Must be one of: {#valids}',
                'any.required': 'if no dietary restrictions exist, please specify `none`',
            })
            .required(),

        allergies: Joi.string()
            .max(200)
            .min(1)
            .messages({
                'string.max': 'Allergies description cannot exceed 200 characters',
                'string.min': 'if no allergies exist, please mention it `none`',
                'any.required': 'if no allergies exist, please mention it `none`',
            })
            .required(),

        additionalNotes: Joi.string()
            .max(500)
            .optional()
            .messages({
                'string.max': 'Additional notes cannot exceed 500 characters'
            })
    }).required()  // ← Whole dietary object is required
    .messages({
        'any.required': 'Dietary information is required'
    }),

    notes: Joi.string()
        .max(1000)
        .optional()
        .messages({
            'string.max': 'Notes cannot exceed 1000 characters'
        })
});

module.exports = {
    eventRegistrationSchema
};