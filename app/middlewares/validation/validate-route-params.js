const { ErrorResponse } = require("../../common/errors");
const logger = require("../../utils/logger");
const mongoose = require("mongoose");

/**
 * @description validation for route params 

*/
 async function validateRouteParams(req, res, next) {

    const routeParams = req.params;

    //validation for mongoose object ids in route params
    for(let [paramName , paramValue] of Object.entries(routeParams)){
        if(paramName.endsWith('Id')){
            if(!mongoose.Types.ObjectId.isValid(paramValue)){
                logger.error(`Invalid route param value: ${paramValue} for param: ${paramName}`);
                return next(new ErrorResponse(400, `Invalid route param value: ${paramValue} for param: ${paramName}`));
            }
        }
    }
    next();
}

module.exports = {
    validateRouteParams,
}