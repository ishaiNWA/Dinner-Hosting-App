const{validateUserSchema} = require("./validate-user-schema");
const {validateEventSchema} = require("./validate-event-schema");    
const {validateEventBusinessRules} = require("./validate-event-business-rules");
const {validateRegistrationSchema} = require("./validate-registration-schema");
const {validateEventRegistrationBusinessRules} = require("./validate-event-registration-business-rules");

module.exports = {
    validateUserSchema,
    validateEventSchema,
    validateEventBusinessRules,
    validateRegistrationSchema,
    validateEventRegistrationBusinessRules,
}