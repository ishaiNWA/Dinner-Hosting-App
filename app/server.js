const env = require ("./config/env");
const logger = require("./utils/logger");
const configDb = require("./config/mongodb");
const app = require('./app');

async function startServer() {
    await configDb.connectToDb();
    
    const server = app.listen(env.PORT, () => {
        logger.info(`App listening on port ${env.PORT}!`);
    });

    // Error handling
    server.on("error", (error) => {
        if (error.code === "EADDRINUSE") {
            logger.error(`Port ${env.PORT} is already in use`);
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

startServer().catch(error => {
    logger.error('Failed to start server:', error);
    process.exit(1);
});

