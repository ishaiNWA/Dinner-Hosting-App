const dbService = require("../../services/db-service")     
const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");


const getMe = async (req, res, next) => {

    let user;
    try{
        user = await dbService.findUserByDocId(req.decodedToken.id);
    }catch(error){
        logger.error(`Error in getMe controller: ${error}`);
        return next(new ErrorResponse(500, "Internal server error"));
    }

    if(!user){
        return next(new ErrorResponse(404, "User not found"));
    }
    res.status(200).json({successStatus: true, data: user});
}

module.exports = { getMe };