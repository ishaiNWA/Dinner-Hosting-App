const passport = require('passport');
const {User} = require("../../models/User");
const jwt = require('jsonwebtoken');
const {userRoles} = require("../../common/user-roles");
const {dietaryRestrictionsArray} = require("../../common/dietary-restrictions");
const mocData = require('./moc-data');
const {generateJWT} = require("../../utils/jwt")


// Mock the passport Google strategy
function setupGoogleStrategyMock(userIsRegistrationComplete = false) {
    // Mock the authenticate method
    passport.authenticate = jest.fn((strategy, callback) => {
        return async (req, res, next) => {
            // Simulate the strategy callback with our mock data
            const user = mocData.mockGoogleProfile;
            user.isRegistrationComplete = userIsRegistrationComplete;
            // Call the callback directly with mock data
            callback(null, user, null);
        };
    });
}

async function seedInitialUserInDB(){
    return await User.create(mocData.mocInitialUser);
}

async function seedCompleteUserInDB(){
    return await User.create(mocData.mockValidCompleteUser);
}

function createAuthCookieForMockUser(user){
    user.id = user._id;
    const token = generateJWT(user);
    const cookie = `jwt=${token}; HttpOnly; Secure; SameSite=Strict`;
    return cookie;
}

function createBadCookie(user){
    const id = user._id;
    const email = user.email;
    const role = user.role ? user.role : null;
    const token = jwt.sign({id, email, role}, "bad-secret-key");
    const cookie = `jwt=${token}; HttpOnly; Secure; SameSite=Strict`;
    return cookie;
}

module.exports = {

    setupGoogleStrategyMock,
    seedInitialUserInDB,
    createAuthCookieForMockUser,
    seedCompleteUserInDB,
    createBadCookie
};










