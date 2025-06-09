const { Schema, model } = require("mongoose");
const eventStatuses = require("../common/event-statuses");

const EventSchema = new Schema({
    hostUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timing: {
        eventDate: {
            type: Date,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        }
    },
    location: {
        address: {
            type: String,
            required: [true, "Please add an address"],
        },
        // Commented out for MVP, but structured for future implementation
        // coordinates: {
        //     type: {
        //         type: String,
        //         enum: ['Point'],
        //     },
        //     coordinates: {
        //         type: [Number],
        //         index: '2dsphere'
        //     }
        // }
    },
    capacity: {
        total: {
            type: Number,
            required: true,
        },
        current: {
            type: Number,
            default: 0,
        }
    },
    dietary: {
        isKosher: {
            type: Boolean,
            required: true,
        },
        isVeganFriendly: {
            type: Boolean,
            required: true,
        },
        additionalOptions: {
            type: String,
            required: false,
        }
    },

    status: {
        current: {
            type: String,
            enum: eventStatuses,
            default: eventStatuses.OPEN_FOR_REGISTRATION,
        },
        history: {
            type: [{
                status: {
                    type: String,
                    enum: eventStatuses,
                    required: true
                },
                statusSubmissionDate: {
                    type: Date,
                    default: Date.now
                }
            }],
            default: [{
                status: eventStatuses.OPEN_FOR_REGISTRATION,
            }]
        }
    },

    registrations: {
      type: [Schema.Types.ObjectId],
      ref: "EventRegistration",
      default: [],
    },
 

})



const Event = model("Event", EventSchema);

module.exports = Event;