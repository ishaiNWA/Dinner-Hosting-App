const NodeGeocoder = require('node-geocoder');
const env = require("../config/env");
const logger = require("../utils/logger")

const options = {
  provider: env.GEOCODER_PROVIDER,
  apiKey: env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

/**
 * @function getLocationObject
 * @description
 * Takes a human-readable address string and returns a location object (or array of objects) 
 * containing geocoded information such as latitude, longitude, formatted address, etc.
 *
 * @throws {Error} 
 * Throws an error if the geocoding process fails, such as due to network issues,
 * invalid API key, request quota exceeded, or if the input address is invalid.
 */
async function getLocationObject(address) {
  if (!address || typeof address !== 'string') {
    logger.debug("Invalid address input")
    throw new Error("Invalid address input");
  }

  try {
    const results = await geocoder.geocode(address);
    if (!results || results.length === 0) {
        logger.error("No location found for the given address")
      throw new Error("No location found for the given address");
    }
    return results; 
  } catch (error) {
    logger.error(`Geocoding failed: ${error.message}`);
    throw new Error(`Geocoding failed: ${error.message}`);
  }
}


module.exports = {
  getLocationObject,
};
