class ErrorResponse extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message || "Internal Server Error";
    
  }
}

module.exports ={ 
 ErrorResponse};
