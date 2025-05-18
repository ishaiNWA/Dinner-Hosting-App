const env = require ("./config/env");
const logger = require("./utils/logger");
const express = require("express");
const app = express();


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