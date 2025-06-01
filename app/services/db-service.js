const {User, Guest, Host} = require("../models/User");
const {userRoles} = require("../common/user-roles");
const logger = require("../utils/logger");



async function updateUserByRole(userDocOId , role , userObjectForUpdate){

    if(role != userRoles.GUEST && role != userRoles.HOST){
        throw new Error("no valid role is defined for the user object")
    }
    let roleSchema = (role === userRoles.GUEST) ? Guest : Host ;

    return await updateDoc(roleSchema ,userDocOId , userObjectForUpdate);
}

/***************************************************************/

async function updateDoc(model , docId , dataObject){

    try{
        const updatedDoc = await model.findByIdAndUpdate(docId , { $set: dataObject },
            {
                new: true,
                runValidators: true  
            });
        return updatedDoc;
    }catch(error){
        logger.error(`Error in updateDoc: ${error}`);
        throw error;
    }

}

/***************************************************************/


async function findUserByDocId(docId){
    return await findDocById(User , docId)
}    

/***************************************************************/

async function findDocById(model , docId){
    try{
        let doc = await model.findDocById(docId);
        return doc;
    }catch(error){
        logger.error(`Error in findDocById: ${error}`);
        throw error;
    }
}

/***************************************************************/

async function findUserByEmail(email){
    return await findDoc(User , {email});
}

/***************************************************************/

async function findDoc(model , queryObject){
    try{
        let doc = await model.findOne(queryObject);
        return doc;
    }catch(error){
        logger.error(`Error in findDoc: ${error}`);
        throw error;
    }
}


/***************************************************************/

async function createUserByOauth(userData){
   return await createDoc(User , userData);
}

/***************************************************************/

async function createDoc(model , dataObject){
    try{
    const doc = await model.create(dataObject);
    return doc;
    }catch(error){
        logger.error(`Error in createDoc: ${error}`);
        throw error;
    }
}

/***************************************************************/
module.exports = {
    createUserByOauth,
    findUserByEmail,
    findUserByDocId,
    updateUserByRole
};


