const Ajv = require('ajv')

/**
 * By default, ajv only returns first error it finds.
 * We want it to return all errors to ease user frustration when sending invalid paylaod.
 */
const validatorConfig = {
  allErrors: true,
  logger: {
    log: function log() {
      return null
    },
    warn: function warn() {
      return null
    },
    error: console.error.bind(console),
  },
}

class Validator {
  constructor(schema, settings) {
    this.ajv = new Ajv(settings)
    this.schema = schema
    this.validator = this.ajv.compile(this.schema)
  }

  validate(resource) {
    const isValid = this.validator(resource)
    return isValid ? [] : this.validator.errors
  }
}

module.exports = { Validator, validatorConfig }
