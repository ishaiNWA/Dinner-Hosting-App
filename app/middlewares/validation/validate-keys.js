    const { validUserSchemaKeysArray} = require("../../models/User");

const validateKeys = (req, res, next) => {

    let paramsArray = [];
    //validate keys exost in schema!
  if (req.query.fields){
    paramsArray = req.query.fields.split(",");
    // Trim whitespace from each field
    paramsArray = paramsArray.map(field => field.trim());
    let nonValidFields = paramsArray.filter((field)=> !validUserSchemaKeysArray.includes(field)
    )

    if(nonValidFields.length > 0){
        console.log(`Invalid fields: ${nonValidFields.join(", ")}`);
       return res.status(400).json({
        success: false,
        message: `Invalid fields: ${nonValidFields.join(", ")}`
       })
    }
    req.fieldsArray = paramsArray;

  }else if(req.query.include){
    paramsArray = req.query.include.split(",");
    paramsArray = paramsArray.map(field => field.trim());
    let nonValidFields = paramsArray.filter((field)=> !validUserSchemaKeysArray.includes(field)
    )

    if(nonValidFields.length > 0){
        console.log(`Invalid fields: ${nonValidFields.join(", ")}`);
       return res.status(400).json({
        success: false,
        message: `Invalid fields: ${nonValidFields.join(", ")}`
       })
    }
    req.includeArray = paramsArray;
  }

  next();

}

module.exports = {validateKeys}