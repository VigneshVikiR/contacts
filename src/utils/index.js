const Ajv = require('ajv');
const boom = require('boom');

const ajv = new Ajv({
  allErrors: true,
  format: 'full',
  useDefaults: true,
  coerceTypes: 'array',
  errorDataPath: 'property',
  sourceCode: false,
  jsonPointers: true,
});

// Prevent "meta schema not defined" debug output
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

require('ajv-keywords')(ajv, ['switch']);
require('ajv-errors')(ajv);

const deepTrim = object => {
  if (object != null) {
    if (typeof object === 'object' || object instanceof Object) {
      for (const property in object) {
        object[property] = deepTrim(JSON.parse(JSON.stringify(object[property])));
      }
    } else if (typeof object === 'string' || object instanceof String) {
      const str = object.trim();
      object = str === '' ? null : str;
    }
  }
  return object;
};

const validateParams = (params, schema) =>
  new Promise((resolve, reject) => {
    params = deepTrim(params);
    const validate = ajv.compile(schema);
    const isValidParams = validate(params);
    if (!isValidParams) {
      let validateErrors = [];
      let errorMsg = 'Input validation failed';
      validate.errors.forEach(error => {
        if (error.keyword === 'errorMessage') {
          validateErrors = validateErrors.concat(error.params.errors);
          errorMsg = validate.errors.length === 1 ? error.message : errorMsg;
        } else {
          validateErrors.push(error);
        }
      });
      const error = new boom.BadRequestError(errorMsg);
      error.errors = validateErrors;
      return reject(error);
    }
    return resolve();
  });
module.exports.validateParams = validateParams;
