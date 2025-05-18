
const sleep = async function (sleepTimeInMs) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, sleepTimeInMs);
  });
};

module.exports = {
  sleep
};
