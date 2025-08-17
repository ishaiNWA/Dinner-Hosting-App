const dbService = require('../../services/db-service');
const logger = require('../../utils/logger');
const { ErrorResponse } = require('../../common/errors');
const jwt = require('../../utils/jwt');
const platforms = require('../../common/platforms');
const ONE_DAY_IN_MS = 60 * 60 * 24 * 1000;

/**
 * Middleware to complete user registration
 * Transforms nested request data into flat structure for database
 * and handles the registration completion process
 */
const completeProfile = async (req, res, next) => {

    const {id} = req.decodedToken;
    const {role} = req.body.userDataForm;
    
    const userDoc = await dbService.findUserByDocId(id);
    if(userDoc.isRegistrationComplete){
        return next(new ErrorResponse(400, 'User already completed profile'));
    }

    const standartUserData = standardizeUserData(req.body.userDataForm)

    let newUpdatedUser;
    try{
        newUpdatedUser = await dbService.updateUserByRole(id, role , standartUserData)
        if(! newUpdatedUser){
            return next(new ErrorResponse(404, 'User not found'));
        }
    }catch(error){
        logger.error(`Error in completeProfile: ${error}`);
        return next(new ErrorResponse(500, 'Internal server error while updating user'));
    }


    console.log(`THIS IS RETURNED COMPLETED USER DOC!!: ${JSON.stringify(newUpdatedUser, null, 2)}`);
    const token = jwt.generateJWT(newUpdatedUser);

    console.log(`THIS IS THE TOKEN!!: ${token}`);
    
    const platform = req.query.platform; // this is the platform that the user is coming from

    console.log(`THIS IS THE PLATFORM!!: ${platform}`);

    if (platform === platforms.WEB) {
      const cookieOptions = {
        expires: new Date(Date.now() + ONE_DAY_IN_MS
      ),
        httpOnly: true,
        secure: true, //always true when using ngrok server
        sameSite: 'none',  // Required for cross-origin cookies
        domain: undefined  // Let browser handle domain
      };
      res.cookie('jwt', token, cookieOptions);

        res.status(200).json({
            message: "User completed registration successfully",
            user: newUpdatedUser
        });
    } else {
        // mobile - send token in response body
        res.status(200).json({
            message: "User completed registration successfully",
            user: newUpdatedUser,
            token: token  // Include token for mobile to store in SecureStore
        }); 
    }
}


/**
 * Standardizes user data - by flattening the object - for database insertion
 * @param {Object} userDataForm - User data from form submission
 * @returns {Object} - Standardized user data with isRegistrationComplete set to true
 */
function standardizeUserData(userDataForm){

    const {roleDetails , ...restOfUserObject} = userDataForm;
    const {contactDetails, ...restOfRoleDetails } = roleDetails;

    const newFormatObject = {
        ...restOfUserObject,
        ...contactDetails,
        ...restOfRoleDetails
    }
    newFormatObject.isRegistrationComplete = true;

    return newFormatObject;
}


module.exports = {completeProfile};