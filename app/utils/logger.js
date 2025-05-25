const winston = require('winston');
const path = require('path');
const { colorize, json, errors, combine, printf ,  timestamp, simple } = winston.format;


// Add a custom level for DB errors
const levels = {
  error: 0,
  dbError: 1, // New level specifically for DB errors
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
};

// Add color for the new level (optional)
const colors = {
  error: 'red',
  dbError: 'magenta', // Color for DB errors
  warn: 'yellow',
  info: 'green',
  http: 'cyan',
  debug: 'blue',
};

// Add colors to Winston
winston.addColors(colors);

const loggingFormat = winston.format.combine(
   timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
   errors({ stack: true }),
   json(),
   printf(({ timestamp, level, message, stack }) =>
    `${timestamp} ${level.toUpperCase()}: ${stack || message}`
))

const logger = winston.createLogger({
  levels,
  format : loggingFormat,

  transports:[

    new winston.transports.Console({ 
    level: 'debug',
    format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),

    // General error log file
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error' ,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),


    // DB error specific log file
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/db-error.log'), 
      level: 'dbError',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
  ]
})

module.exports = logger;