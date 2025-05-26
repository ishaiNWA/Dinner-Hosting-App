const env = require ("./config/env");
const logger = require("./utils/logger");
const express = require("express");
const {ErrorResponse} = require("./common/errors")
const configDb = require("./config/mongodb")
const app = express();
const morgan = require('morgan');     
const cookieParser = require('cookie-parser'); 
const session = require('express-session');
const passport = require('passport');
require('./services/passport-auth-service'); //configures passport strategies
const authRoute = require("./routes/auth-route"); 
         


app.use(morgan('dev'));  // HTTP request logger middleware
app.use(cookieParser());// parse cookies from the HTTP headers
app.use(express.json()); //parse incoming JSON payloads (application/json)
app.use(express.urlencoded({ extended: true })); //parse URL-encoded data (form submissions)




app.use(session({
  secret: env.LOGIN_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000, // 10 minutes - just for OAuth flow
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", authRoute); 

// 404 handler - 
app.use((req, res, next) => {
  next(new ErrorResponse('Route not found', 404));
});

configDb.
connectToDb().then(()=>
  {
let server;
  server = app.listen(env.PORT, () => {
    logger.info(`App listening on port ${env.PORT}!`);
});

    // Error handling
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        logger.error(`Port ${PORT} is already in use`);
      } else {
        logger.error("Server error:", error);
      }
      process.exit(1);
    });

        ["SIGTERM", "SIGINT"].forEach((endingSignal) => {
      process.on(endingSignal, () => {
        logger.info(
          `\n${endingSignal} ending signal was sent. shut down server gracefully and exit program.`
        );
        server.close(() => {
          process.exit(0);
        });
      });
    });
}

)

