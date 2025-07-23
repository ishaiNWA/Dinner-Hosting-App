const dbService = require("../../services/db-service")     
const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");

const buildUserDefaultProfileStructure = (userDoc) => {
    let userProfile = {
        userId: userDoc._id,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        email: userDoc.email,
    }
    return userProfile;
}

const buildUserSpecificProfileStructure = (userDoc, specificFieldsArray) => {
    let userProfile = {};
    specificFieldsArray.forEach((field) => {
      userProfile[field] = userDoc[field];
    });
    return userProfile;
  }

const buildIncludedFieldsObject = (userData, userDoc, includeFieldsArray) => {

    includeFieldsArray.forEach((field) => {
        userData[field] = userDoc[field];
    });
    return userData;
}

const getMe = async (req, res, next) => {

    let userDoc;
    try{
        userDoc = await dbService.findUserByDocId(req.decodedToken.id);
    }catch(error){
        logger.error(`Error in getMe controller: ${error}`);
        return next(new ErrorResponse(500, "Internal server error"));
    }

    if(!userDoc){
        return next(new ErrorResponse(404, "User not found"));
    }

    let userData;
    try {
        if(req.fieldsArray){
            console.log("THIS IS THE FIELDS ARRAY: ", req.fieldsArray);
            console.log("IS THIS AN ARRAY: ", Array.isArray(req.fieldsArray));
            userData = buildUserSpecificProfileStructure(userDoc, req.fieldsArray);
        }else{
            userData = buildUserDefaultProfileStructure(userDoc);
                if(req.includeArray){
                console.log("include", req.includeArray);
                userData = buildIncludedFieldsObject(userData, userDoc, req.includeArray);
            }
        }
    } catch (error) {
        logger.error(`Error building user data: ${error.message}`);
        return next(new ErrorResponse(400, error.message));
    }
    

    console.log("RETURNING USER DATA: ", userData);
    res.status(200).json({successStatus: true, user: userData});
}

module.exports = { getMe };