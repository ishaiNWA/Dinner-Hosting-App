const { Schema, model } = require("mongoose");
const registrationStatuses = require("../common/registration-statuses");

const EventRegistrationSchema = new Schema({ 

    eventId : {
        type : Schema.Types.ObjectId,
        ref : "Event",
        required : true,
    },
    guestId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    status : {
        current : {
            type : String,
            enum : registrationStatuses,
            default : registrationStatuses.PENDING,
        },
        history : [{
            status : {
                type : String,
                enum : registrationStatuses,
                default : registrationStatuses.PENDING,
            },
            statusSubmissionDate : {
                type : Date,
                default : Date.now,
            }
        }]
    },
    numberOfGuests : {
        type : Number,
        default : 1,
    },
    dietary : {
        dietaryRestrictions : {
            type : [String], 
            enum : dietaryRestrictionsArray,
            required : true,
        },
        allergies : {
            type : String,
            default : "none",
        },
        additionalNotes : {
            type : String,
            required : false,
        }
    },

    notes : {
        type : String,
        required : false,
    },
})

const EventRegistration = model("EventRegistration", EventRegistrationSchema);

module.exports = EventRegistration;




