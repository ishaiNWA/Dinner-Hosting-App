const dbService = require('../../services/db-service');
const logger = require('../../utils/logger');
const { ErrorResponse } = require('../../common/errors');

/**
 * Middleware to complete user registration
 * Transforms nested request data into flat structure for database
 * and handles the registration completion process
 */
const completeProfile = async (req, res, next) => {

    const {id} = req.token;
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
    console.log(`newUpdatedUser is : ${JSON.stringify(newUpdatedUser, null, 2)}`);
    res.status(200).json({
        message: "User completed registration successfully",
        user: newUpdatedUser
    });
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