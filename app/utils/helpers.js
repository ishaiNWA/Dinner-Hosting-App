/**
 * @description sleep for a given time
 * @param {number} sleepTimeInMs - time in milliseconds
 * @returns {Promise}
 */
const sleep = async function (sleepTimeInMs) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, sleepTimeInMs);
  });
};

/**
 * @description get the date of the week from now
 * @returns {Date}
 */
function getDateWeekFromNow(){
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

module.exports = {
  sleep,
  getDateWeekFromNow
};
