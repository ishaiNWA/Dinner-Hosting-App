const { Schema, model } = require("mongoose");
const eventStatuses = require("../common/event-statuses");
const { dietaryRestrictionsArray } = require("../common/dietary-restrictions");

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

    bookedParticipants: {
        type: [{
          guestId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
          },
          guestName: {
            type: String,
            required: true
          },
          guestEmail: {
            type: String,
            required: true
          },
          guestPhone: {
            type: String,
            required: true
          },
          registeredAt: {
            type: Date,
            default: Date.now
          },
          dietaryRestrictions: {
            type: [String],
            enum: dietaryRestrictionsArray,
            required: true
          },
          allergies: {
            type: String,
            required: true,
            message: "Allergies are required - specify 'none' if none"
          },
          plusOne: {
            type: Number,
            default: 0,
          },
          notes: {
            type: String,
            required: false
          }
        }],
        default: []
      }
})

const Event = model("Event", EventSchema);

module.exports = Event;