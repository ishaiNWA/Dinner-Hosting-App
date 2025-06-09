const { Schema, model } = require("mongoose")
const logger = require("../utils/logger");
const geocoderService = require("../services/geocoder-service")
const { ErrorResponse } = require("../common/errors");
const {dietaryRestrictionsArray} = require("../common/dietary-restrictions");

const options = { discriminatorKey: 'role', collection: 'users' };

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  isRegistrationComplete :{
    type : Boolean,
    default : false,
  }
}, options);

// const ManagerSchema = new Schema({
//   // Manager-specific fields here
// });

// Define shared contact details fields
const contactDetails = {
  phoneNumber: {
    type: String,
    required: [true, "Please add a phone number"],
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  // ,
  // location: {
  //   // GeoJSON Point
  //   type: {
  //     type: String,
  //     enum: ["Point"],
  //   },
  //   coordinates: {
  //     type: [Number],
  //     index: "2dsphere",
  //   },
  //   formattedAddress: String,
  //   street: String,
  //   city: String,
  //   state: String,
  //   zipcode: String,
  //   country: String,
  // }
};

const HostSchema = new Schema({
  isAuthorizedByManager: {
    type: Boolean,
    default: false,
  },
  publishedEvents: {
    type: [Schema.Types.ObjectId],
    ref: 'Event',
    default: [],
  },
  //attaching contact details fields to HostSchema
  ...contactDetails,
});

const GuestSchema = new Schema({
  isAuthorizedByManager: {
    type: Boolean,
    default: false,
  },
  //attaching contact details fields to GuestSchema
  ...contactDetails,
  dietaryRestrictions: {
    type: [String],
    enum: {
      values: dietaryRestrictionsArray,
      message: '{VALUE} is not a valid dietary restriction'
    },
    required: true,
  },
  allergies: {
    type: String,
    default: "none",
  },
  registeredEvents: {
    type: [Schema.Types.ObjectId],
    ref: 'Event',
    default: [],
  }
});

// registerPreSaveGeocodingMiddleware = (schema) => {
//   schema.pre("save", async function(next) {
//     if (this.address) {
//         const locations = await geocoderService.getLocationObject(this.address);
//         const locationObj = locations[0]; // Gets the first item from the array
        
//         if (!locationObj || locationObj.countryCode !== "IL") {
//           logger.error('Address must be located in Israel');
//           return next(new ErrorResponse('Address must be located in Israel', 400));
//         }
        
//         this.location = {
//           type: "Point",
//           coordinates: [locationObj.longitude, locationObj.latitude],
//           formattedAddress: locationObj.formattedAddress,
//           street: locationObj.streetName,
//           city: locationObj.city,
//           state: locationObj.stateCode,
//           zipcode: locationObj.zipcode,
//           country: locationObj.countryCode,
//         };
        
//         // Do not save address in DB
//         this.address = undefined;
//     }
//     next();
//   });
// };

// registerPreSaveGeocodingMiddleware(HostSchema);
// registerPreSaveGeocodingMiddleware(GuestSchema);

// Create and export the models
const User = model('User', UserSchema);
const Host = User.discriminator('Host', HostSchema);
const Guest = User.discriminator('Guest', GuestSchema);
// const Manager = User.discriminator('MANAGER', ManagerSchema);

module.exports = {
  User,
  Host, 
  Guest,
  // Manager
};