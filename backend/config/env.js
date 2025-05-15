const _ = require("lodash");

const MANDATORY_VARS = ["JWT_SECRET_KEY"];

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

  //server related vars
  env.PORT = process.env.PORT || "5000",
    // Mongo related vars.
  env.MONGODB_ADDRESSES = process.env.MONGODB_ADDRESSES || "localhost:27017";
}

// one time script initiation
    init();

module.exports = env;