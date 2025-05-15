const env = require ("./config/env");
const express = require("express");
const app =express();


let server;

  server = app.listen(env.PORT, () => {
    console.log(`App listening on port ${env.PORT}!`);
});

    // Error handling
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error("Server error:", error);
      }
      process.exit(1);
    });

        ["SIGTERM", "SIGINT"].forEach((endingSignal) => {
      process.on(endingSignal, () => {
        console.log(
          `\n${endingSignal} ending signal was sent. shut down server gracefully and exit program.`
        );
        server.close(() => {
          process.exit(0);
        });
      });
    });