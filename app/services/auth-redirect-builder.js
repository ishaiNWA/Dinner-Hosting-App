const {appRedirectUrls} = require("../common/app-redirect-urls");

const MOBILE = appRedirectUrls.MOBILE;
const WEB = appRedirectUrls.WEB;

function buildMobileSuccessRedirect(token, user, isRegistrationComplete){
    const encodedUserData = encodeURIComponent(JSON.stringify(user));
    return `${MOBILE.SUCCESS}?token=${token}&user=${encodedUserData}&isRegistrationComplete=${isRegistrationComplete}`;
}

function buildMobileErrorRedirect(error){
    return `${MOBILE.ERROR}?error=${encodeURIComponent(error)}`;
}

function buildWebSuccessRedirect( user, isRegistrationComplete){
    const frontendUrl = WEB.SUCCESS;
    return `${frontendUrl}?user=${encodeURIComponent(JSON.stringify(user))}&isRegistrationComplete=${isRegistrationComplete}`;
}

module.exports = {buildMobileSuccessRedirect, buildMobileErrorRedirect, buildWebSuccessRedirect};