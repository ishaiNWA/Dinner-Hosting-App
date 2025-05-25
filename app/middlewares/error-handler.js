const logger = require("../utils/logger")
const {ErrorResponse} = require("../common/errors")

const DUPLICATE_KEY_ERROR_CODE = 11000;

const errorHandler = (err, req, res, next) => {
  // Log for debugging
  logger.error(JSON.stringify(err));

  let errorResponse = err instanceof ErrorResponse ? err : createPropeResponseForCommonErrors(err)

  return res.status(errorResponse.statusCode).json({
    successStatus: false,
    data: errorResponse.message
  });
}

function createPropeResponseForCommonErrors(err) {
  let errorResponse = null;

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle JSON parsing errors
    errorResponse = new ErrorResponse(JSON.stringify({ 
      message: "Invalid JSON syntax", 
      description: "The request contains malformed JSON",
      type: "error",
      details: err.message
    }), 400);
    
  //check for Mongoose duplicate key insertion.
  } else if (err.code === DUPLICATE_KEY_ERROR_CODE) {
    const message = `resource with name of: ${JSON.stringify(
      err.keyValue
    )}, is already existed`;
    errorResponse = new ErrorResponse(message, 400);
  
  //check for mongoose validation error.
  } else if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    errorResponse = new ErrorResponse(message, 400);
  
  // Mongoose bad ObjectId
  } else if (err.name === "CastError") {
    errorResponse = new ErrorResponse(`Resource not found with id: ${err.value}`, 404);
  }

  return errorResponse || new ErrorResponse(err, 500);
}

module.exports = {
  errorHandler
}