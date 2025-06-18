const Joi = require("joi");
const { getDateWeekFromNow } = require("../../../utils/helpers");

const eventSchema = Joi.object({
    // Timing validation
    timing : Joi.object({
        eventDate: Joi.date()
        .greater(getDateWeekFromNow())
        .required()
        .messages({
            "date.greater": "Event date must be at least one week from now",
            "any.required": "Event date is required"
        }),

}).required(),

    // Location validation
    location: Joi.object({
        address: Joi.string()
            .min(5)
            .max(200)
            .required()
            .messages({
                'string.min': 'Address must be at least 5 characters',
                'string.max': 'Address cannot exceed 200 characters',
                'any.required': 'Address is required'
            })
    }).required(),

    // Dietary validation
    dietary: Joi.object({
        isKosher: Joi.boolean()
            .required()
            .messages({
                'any.required': 'Kosher specification is required'
            }),
        isVeganFriendly: Joi.boolean()
            .required()
            .messages({
                'any.required': 'Vegan-friendly specification is required'
            }),
        additionalOptions: Joi.string()
            .min(2)
            .max(500)
            .optional()
            .messages({
                'string.min': 'Dietary option must be at least 2 characters',
                'string.max': 'Dietary option cannot exceed 50 characters'
            })
    }).required()
});

module.exports = {
    eventSchema
}