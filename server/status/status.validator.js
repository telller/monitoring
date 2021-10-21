const { Validator, validatorConfig } = require('../utils/validator')
const StatusSchema = require('./status-schema.json')

/**
 * @function userValidator
 * @description validates against the user json schema defined above
 * @returns {Function<Array>} function that returns an array of errors or empty array if valid
 */
module.exports = new Validator(StatusSchema, validatorConfig)
