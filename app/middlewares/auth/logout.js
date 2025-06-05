const dbService = require("../../services/db-service");
const logger = require("../../utils/logger");
const { extractRawTokenFromRequest } = require("../../utils/jwt");
const { ErrorResponse } = require("../../common/errors");

const logout = async (req, res, next) => {

    const rawToken = extractRawTokenFromRequest(req);
    const blackListedTokenObject = {
        token : rawToken,
        expires : new Date(req.decodedToken.exp * 1000)
    }

    try{
        await dbService.createBlackListedToken(blackListedTokenObject);
        res.clearCookie("jwt");
        return res.status(200).json({ successStatus: true,
            message: "Logged out successfully"});
    }catch(error){
        logger.error(`Error in logout middleware: ${error}`);
        return next(new ErrorResponse(500, 'Internal server error'));
    }
 }
 

module.exports = { logout };