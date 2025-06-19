const {User, Guest, Host} = require("../models/User");
const Event = require("../models/Event");
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

        await session.commitTransaction();
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

async function findEventByDocId(docId){
    return await findDocById(Event , docId)
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

async function findMultipleDocs(model , queryObject){
    try{
        let docs = await model.find(queryObject);
        return docs;
    }catch(error){
        logger.error(`Error in findMultipleDocs: ${error}`);
        throw error;
    }
}
/***************************************************************/

/**
 * @description push an item to an array in a document
 * @param {model} - the model to update
 * @param {object} - the filter object to find the document
 * @param {object} - the object to push to the array
 * @param {object} - the session to use
 * @returns {object} - the updated document
 */
async function pushItemToDocArray(model, docFilterObj, arrayUpdateObj, session = null){
    try{
        const doc = await model.findOneAndUpdate(
            docFilterObj, 
            { $push: arrayUpdateObj }, 
            { session, new: true }
        );
        
        if(!doc){
            throw new Error("no document found to update");
        }


        return doc;
    }catch(error){
        logger.error(`Error in pushItemToDocArray: ${error}`);
        throw error;
    }
}

/***************************************************************/

async function updateDoc(model, docFilterObj, updateObj, session = null){

        return await model.findOneAndUpdate
            (docFilterObj,
            updateObj,
            {session, new: true, runValidators: true});
}

/***************************************************************/

async function updateEventStatus(eventFilterObj, newStatus){
    const updateObj = {
        $set: {
        "status.current": newStatus,
        "timing.lastUpdated": new Date()
      },
      $push: {
        "status.history": {
          status: newStatus,
          statusSubmissionDate: new Date()
        }
      }
    };
    

    return await updateDoc(Event, eventFilterObj, updateObj);
}

/***************************************************************/

async function createUserByOauth(userData){
   return await createDoc(User , userData);
}

/***************************************************************/

async function findEventDoc(queryObject){
    return await findDoc(Event , queryObject);
}

/***************************************************************/

/**
 * 
 * @description creating a document in the database
 * can handle mongoose session
 * return a single document
 */
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

async function publishEventForHostUser(hostUserId, eventForm){

    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        
        //1. create the event doc
        const eventDoc = await createDoc(Event, eventForm, session);
        
        //2. update Host's publishedEvents array
        await pushItemToDocArray(
            Host, 
            { _id: hostUserId }, 
            { publishedEvents: eventDoc._id }, 
            session
        );

        await session.commitTransaction();
        return eventDoc;
    }catch(error){
        await session.abortTransaction();
        logger.error(`Error in publishEventForHostUser: ${error}`);
        throw error;
    }finally{
        await session.endSession();
    }
}
/***************************************************************/

async function bookGuestForEvent(bookingForm, eventDoc, guestDoc){

    const guestId = guestDoc._id;
    const eventId = eventDoc._id;

    const session = await mongoose.startSession();

    try{
        session.startTransaction();

        // Add participant to event
        await pushItemToDocArray(Event, {_id: eventDoc._id},
            {bookedParticipants: bookingForm},
            session
        )
        
        console.log(`DEBUG: guestId type: ${typeof guestId}, value: ${guestId}`);
        console.log(`DEBUG: eventId type: ${typeof eventId}, value: ${eventId}`);
        
        
        const guestDoc =  await pushItemToDocArray(Guest, {_id: guestId},
             {upcomingEvents: eventId}
             , session)

        console.log(`DEBUG updated guestDoc: ${JSON.stringify(guestDoc)}`)

        await session.commitTransaction();
        
        logger.info(`Successfully booked guest ${guestId} for event ${eventId}`);
        
    }catch(error){
        await session.abortTransaction();
        logger.error(`Error in bookGuestForEvent: ${error.message}`, error);
        throw error;
        
    }finally{
        await session.endSession();
    }

}

/***************************************************************/

async function findMultipleEvents(queryObject){
    return await findMultipleDocs(Event, queryObject);
}

/***************************************************************/


module.exports = {
    createUserByOauth,
    findUserByEmail,
    findUserByDocId,
    updateUserByRole,
    findBlackListdToken,
    createBlackListedToken,
    findEventDoc,
    publishEventForHostUser,
    findMultipleEvents,
    findEventByDocId,
    bookGuestForEvent,
    updateEventStatus,
};


