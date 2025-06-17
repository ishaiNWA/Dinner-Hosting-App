const { Schema, model } = require("mongoose");
const registrationStatuses = require("../common/registration-statuses");
const { dietaryRestrictionsArray } = require("../common/dietary-restrictions");

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
        type :{
        current : {
            type : String,
            enum : registrationStatuses,

        },
        history : [{
            status : {
                type : String,
                enum : registrationStatuses,
            },
            statusSubmissionDate : {
                type : Date,
            }
        }]
    },
     default : function initStatus(){
        return {
            current : registrationStatuses.PENDING,
            history : [{
                status : registrationStatuses.PENDING,
                statusSubmissionDate : Date.now(),
            }],
        }
    },
},   
    numberOfGuests : {
        type : Number,
        default : 1,
    },
    dietary : {
        type: {
            dietaryRestrictions : {
                type : [String], 
                enum : {
                    values: dietaryRestrictionsArray,
                    message: '{VALUE} is not a valid dietary restriction'
                },
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
        required: true  // ← This makes the WHOLE dietary object required
        // Without this, client could send {} with no dietary object at all
    },

    notes : {
        type : String,
        required : false,
    },
})

const EventRegistration = model("EventRegistration", EventRegistrationSchema);

module.exports = EventRegistration;




