const logger = require("../utils/logger")
const {ErrorResponse} = require("../common/errors")

const DUPLICATE_KEY_ERROR_CODE = 11000;

const errorHandler = (err, req, res, next) => {
  // Enhanced logging for tests
    console.log('\nError Handler Caught:');
    console.log('Error Message:', err.message);
    console.log('Error Stack:', err.stack);
    if (err.errors) {
      console.log('Validation Errors:', JSON.stringify(err.errors, null, 2));
    }


  // Log for debugging
  logger.error(JSON.stringify(err, null, 2));

  let errorResponse = err instanceof ErrorResponse ? err : createPropeResponseForCommonErrors(err)




  return res.status(errorResponse.statusCode).json({
    successStatus: false,
    error: {
      message: errorResponse.message,
      data: err.errors || err.stack // Include more details in the response
    }
  });
}

function createPropeResponseForCommonErrors(err) {
  let errorResponse = null;

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle JSON parsing errors
    errorResponse = new ErrorResponse(400, JSON.stringify({ 
      message: "Invalid JSON syntax", 
      description: "The request contains malformed JSON",
      type: "error",
      details: err.message
    }));
    
  //check for Mongoose duplicate key insertion.
  } else if (err.code === DUPLICATE_KEY_ERROR_CODE) {
    const message = `resource with name of: ${JSON.stringify(
      err.keyValue
    )}, is already existed`;
    errorResponse = new ErrorResponse(400, message);
  
  //check for mongoose validation error.
  } else if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    errorResponse = new ErrorResponse(400, message);
  
  // Mongoose bad ObjectId
  } else if (err.name === "CastError") {
    errorResponse = new ErrorResponse(404, `Resource not found with id: ${err.value}`);
  }

  return errorResponse || new ErrorResponse(500, err);
}

module.exports = {
  errorHandler
}