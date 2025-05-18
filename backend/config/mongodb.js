const mongoose = require("mongoose");
const env = require("./env");
const logger = require("../utils/logger");
const { sleep } = require("../utils/helpers");

const MAX_ATTEMPTS = 3;
const INITIAL_WAITING_TIME_IN_MS = 5000;

async function connectToDb() {
  await mongoose.connect(
    `${env.MONGODB_URI}/${env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`,
  );
}

// Attach connection listeners once
mongoose.connection.on("connected", () => {
  logger.info(`Successfully connected to "${env.MONGODB_DATABASE_NAME}" data base`);
});

mongoose.connection.on("disconnected", async () => {
  logger.error(" MongoDB disconnected. Attempting to reconnect...");

  let waitingTime = INITIAL_WAITING_TIME_IN_MS;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; ++attempt) {
    try {
      logger.info(`Attempt ${attempt} to reconnect...`);
      await sleep(waitingTime);
      await connectToDb();
      logger.info(`Reconnected to MongoDB on attempt ${attempt}`);
      return;
    } catch (error) {
      logger.error(`Reconnection attempt ${attempt} failed`, error);

      if (attempt === MAX_ATTEMPTS) {
        logger.error("Max reconnection attempts reached.");
        throw error;
      }

      waitingTime *= 2; // exponential backoff
    }
  }
});
module.exports = {
    connectToDb
}
