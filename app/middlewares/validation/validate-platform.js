const platforms = require("../../common/platforms");


const validatePlatform = (req, res, next) => {

    //no platform means `web`
    const platform = req.query.platform || platforms.WEB;

    if (! Object.values(platforms).includes(platform)) {
        return res.status(400).json({ message: 'Invalid platform. Valid platforms are: ' + Object.values(platforms).join(', ') });
    }

    req.platform = platform;
    console.log(`REQ.PLATFORM IS: ${req.platform}`);
    next();
}

module.exports = { validatePlatform };