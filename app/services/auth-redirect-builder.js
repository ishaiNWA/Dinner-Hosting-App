const {appRedirectUrls} = require("../common/app-redirect-urls");

const MOBILE = appRedirectUrls.MOBILE;

function buildMobileSuccessRedirect(token, user, isRegistrationComplete){
    const encodedUserData = encodeURIComponent(JSON.stringify(user));
    return `${MOBILE.SUCCESS}?token=${token}&user=${encodedUserData}&isRegistrationComplete=${isRegistrationComplete}`;
}

function buildMobileErrorRedirect(error){
    return `${MOBILE.ERROR}?error=${encodeURIComponent(error)}`;
}

module.exports = {buildMobileSuccessRedirect, buildMobileErrorRedirect};