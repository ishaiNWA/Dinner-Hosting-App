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

// Create different logger configurations for test and non-test environments
const transports = process.env.NODE_ENV === 'test' ? [
  // During tests, only log to console with all levels
  new winston.transports.Console({ 
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    )
  })
] : [
  // Normal environment transports
  new winston.transports.Console({ 
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    )
  }),
  new winston.transports.File({ 
    filename: path.join(__dirname, '../logs/error.log'), 
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
  new winston.transports.File({ 
    filename: path.join(__dirname, '../logs/db-error.log'), 
    level: 'dbError',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  })
];

const logger = winston.createLogger({
  levels,
  format: loggingFormat,
  transports
});

module.exports = logger;