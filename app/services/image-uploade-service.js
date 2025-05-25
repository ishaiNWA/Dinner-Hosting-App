
const cloudinary = require('cloudinary').v2;
const env = require("../config/env")

cloudinary.config({ 
  cloud_name: env.CLOUDINARY_KEY_NAME, 
  api_key: env.CLOUDINARY_API_KEY, 
  api_secret: env.CLOUDINARY_API_SECRET
});

