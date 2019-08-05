let Ajv = require('ajv');
let ajv = Ajv({ allErrors: true, removeAdditional: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

const addSchema = (prefix, schema) => {
  ajv.addSchema(schema, prefix)
};

/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function errorResponse(schemaErrors) {
  let errors = schemaErrors.map((error) => {
    return {
      path: error.dataPath,
      message: error.message
    }
  });
  return {
    status: 'failed',
    errors: errors
  }
}

/**
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 * @return {Object} response
 */
let validateSchema = (schema) => {
  return (req, res, next) => {
    // merging the query with body
    if (req.query) {
      req.body = Object.assign(req.body, req.query);
    }
    if (req.body) {
      let valid = ajv.validate(schema, req.body);
      if (!valid) {
        return res.send(errorResponse(ajv.errors))
      }
    }
    next()
  }
};

module.exports.validateParams = validateSchema;
module.exports.addSchema = addSchema;
