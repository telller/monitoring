class BadRequestError extends Error {
  constructor(message, ...args) {
    super(message, ...args)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequestError)
    }
    this.name = 'BadRequestError'
    if (Array.isArray(message)) {
      this.operationOutcome = {
        resourceType: 'OperationOutcome',
        issue: message.map(elm => {
          return {
            severity: 'error',
            code: 'invalid',
            details: {
              text: `${elm.message} :${JSON.stringify(
                elm.params
              )}: at position ${elm.dataPath ? elm.dataPath : 'root'}`,
            },
          }
        }),
      }
    } else {
      this.operationOutcome = {
        resourceType: 'OperationOutcome',
        issue: [
          {
            severity: 'error',
            code: 'invalid',
            details: {
              text: message,
            },
          },
        ],
      }
    }

    this.statusCode = 400
  }
}

class NotFoundError extends Error {
  constructor(...args) {
    super(...args)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError)
    }
    this.name = 'NotFoundError'
    this.operationOutcome = {
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'not-found',
          details: { text: 'Not found' },
        },
      ],
    }
    this.statusCode = 404
  }
}

class Forbidden extends Error {
  constructor(...args) {
    super(...args)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Forbidden)
    }
    this.name = 'Forbidden'
    this.operationOutcome = {
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'forbidden',
          details: { text: 'Forbidden operation' },
        },
      ],
    }
    this.statusCode = 403
  }
}

class UnauthenticatedError extends Error {
  constructor(...args) {
    super(...args)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthenticatedError)
    }
    this.name = 'UnauthenticatedError'
    this.operationOutcome = {
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'security',
          details: { text: 'Unauthenticated' },
        },
      ],
    }
    this.statusCode = 401
  }
}

class InternalServerError extends Error {
  constructor(message, ...args) {
    super(message, ...args)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InternalServerError)
    }
    this.name = 'InternalServerError'

    this.operationOutcome = {
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'internal',
          details: {
            text: message || 'Something went wrong',
          },
        },
      ],
    }

    this.statusCode = 500
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
  Forbidden,
  UnauthenticatedError,
  InternalServerError,
}
