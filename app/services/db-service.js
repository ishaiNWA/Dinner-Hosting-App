const {User, Guest, Host} = require("../models/User");
const BlackListTokenModel = require("../models/BlackListToken");
const mongoose = require("mongoose");
const {userRoles} = require("../common/user-roles");
const logger = require("../utils/logger");



async function updateUserByRole(userDocId , role , userObjectForUpdate){

    if(role != userRoles.GUEST && role != userRoles.HOST){
        throw new Error("no valid role is defined for the user object")
    }
    let roleModel = (role === userRoles.GUEST) ? Guest : Host ;

        const session = await mongoose.startSession();
        let newCompleteUserDoc;
        try{
        session.startTransaction();
        const removedUserDoc = await deleteDocById(User , userDocId , session);
         let uniteObject = {...removedUserDoc.toObject(), ...userObjectForUpdate};
        newCompleteUserDoc = await createDoc(roleModel , uniteObject, session);

        }catch(error){
            await session.abortTransaction();
            throw error;
        }finally{
            await session.endSession();
        }

    return newCompleteUserDoc;
}

/***************************************************************/
async function deleteDocById(model , docId, session = null){

    try{
        const doc = await model.findByIdAndDelete(docId, {session});
        return doc
    }catch(error){
        logger.error(`Error in deleteDocById: ${error}`);
        throw error;
    }
}
/***************************************************************/

async function findBlackListdToken(token){
    const findBlackListdToken = await findDoc(BlackListTokenModel, {token});
    return findBlackListdToken;
}

/***************************************************************/

async function createBlackListedToken(blackListedTokenObject){
    const blackListedTokenDoc = await createDoc(BlackListTokenModel, blackListedTokenObject);
    return blackListedTokenDoc;
}

/***************************************************************/

async function findUserByDocId(docId){
    return await findDocById(User , docId)
}    

/***************************************************************/

async function findDocById(model , docId){
    try{
        let doc = await model.findById(docId);
        return doc;
    }catch(error){
        logger.error(`Error in findById: ${error}`);
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

async function createDoc(model , dataObject, session = null){
    try{
    const docs = await model.create([dataObject], {session});
    return docs[0];
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
    updateUserByRole,
    findBlackListdToken,
    createBlackListedToken
};


