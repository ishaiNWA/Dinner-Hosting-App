const Joi = require("joi");
const { getDateWeekFromNow } = require("../../../utils/helpers");

const eventSchema = Joi.object({
    // Event name validation
    eventName: Joi.string()
        .min(3)
        .max(25)
        .required()
        .trim()
        .messages({
            'string.min': 'Event name must be at least 3 characters',
            'string.max': 'Event name cannot exceed 25 characters',
            'any.required': 'Event name is required',
            'string.empty': 'Event name cannot be empty'
        }),

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
            .min(0)
            .max(500)
            .optional()
            .messages({
                'string.min': 'Dietary option must be at least 0 characters',
                'string.max': 'Dietary option cannot exceed 500 characters'
            })
    }).required()
});

module.exports = {
    eventSchema
}