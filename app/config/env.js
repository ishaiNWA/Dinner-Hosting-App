const _ = require("lodash");
require('dotenv').config();

const MANDATORY_VARS = ["JWT_SECRET_KEY" ,"LOGIN_SESSION_SECRET", "MONGODB_URI", "GEOCODER_API_KEY", "CLOUDINARY_API_SECRET", "GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET"];

let env= {};

 function init(){

     const missingFields = MANDATORY_VARS.filter((currVar)=>{
        return !process.env[currVar]
     })

     if(missingFields.length > 0){
      console.error({ msg: 'missing mandatory env variables', context: { missingFields} });
      process.exit(1);
  }

  env.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  env.LOGIN_SESSION_SECRET = process.env.LOGIN_SESSION_SECRET;
  
  //server related vars
  env.PORT = process.env.PORT || "5000",
    // Mongo related vars.
  env.MONGODB_ADDRESSES = process.env.MONGODB_ADDRESSES || "localhost:27017";
  env.MONGODB_URI = process.env.MONGODB_URI;
  env.MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME || 'dinner_app';

//GOOGLE_OAUTH related vars

env.GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
env.GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
env.GOOGLE_OAUTH_CALLBACK_URL = process.env.GOOGLE_OAUTH_CALLBACK_URL || `http://localhost:${env.PORT}/api/auth/google/callback`;


//Geo Coder related vars
env.GEOCODER_PROVIDER = process.env.GEOCODER_PROVIDER || 'opencage'
env.GEOCODER_API_KEY= process.env.GEOCODER_API_KEY;

//Cloudinary image-uploader related vars
env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
env.CLOUDINARY_KEY_NAME = process.env.CLOUDINARY_KEY_NAME || "Dinner-Host-Cloudinary"
env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "421113661632676"

env.NODE_ENV = 'dev';

 // console.log(`env object initiated ${JSON.stringify(env)}`)
}

// one time script initiation
  init();

module.exports = env;