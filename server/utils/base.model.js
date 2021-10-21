const moment = require('moment-timezone')
const { ObjectId } = require('bson')

const globals = require('./globals')
const { CLIENT_DB } = require('./constants')
const { BadRequestError, NotFoundError } = require('./http-errors')

/**
 * @class BaseModel
 * @description a model to extend for non FHIR Resources (e.g., User)
 * usage: `class User extends BaseModel {}` you always want to call
 * `YourModel.initialize()` before using to get proper database access for
 * static methods
 */
class BaseModel {
  constructor(collectionName, validator) {
    const proto = Object.getPrototypeOf(this)

    proto.db = globals.get(CLIENT_DB)
    proto.collection = proto.db.collection(`${collectionName}`)
    proto.historyCollection = proto.db.collection(`${collectionName}_History`)
    proto.validator = validator
  }

  /**
   * @function createIndex
   * @async
   * @static
   * @description mongo `createIndex` method... useful with eventEmitter. See `./src/server/fhir/organization' as example
   * @example `await Organization.initialize().createIndex({name: 1},{unique: true})`
   * @param {*} index
   * @param {*} options
   * @returns {Promise<idx|err>}
   */
  static async createIndex(index, options = {}) {
    return await this.collection.createIndex(index, options)
  }

  static initialize() {
    const proto = Object.getPrototypeOf(this)
    proto.db = globals.get(CLIENT_DB)
    proto.collection = proto.db.collection(`${this.collectionName}`)
    proto.historyCollection = proto.db.collection(
      `${this.collectionName}_History`
    )
    return this
  }

  static create(payload, options = {}) {
    const That = this
    return new Promise((resolve, reject) => {
      const validationError = this.validator.validate(payload)
      if (validationError?.length) {
        return reject(new BadRequestError(validationError))
      }

      const timestamp = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ')
      payload.createdAt = timestamp
      payload.lastUpdated = timestamp

      const doc = payload
      const historyDoc = Object.assign({}, doc)

      this.collection.insertOne(doc, options, (err, result) => {
        if (err) return reject(err)
        historyDoc.id = result.insertedId
        return this.historyCollection.insertOne(historyDoc, err2 => {
          if (err2) return reject(err2)
          doc.id = doc._id.toString()
          return resolve(new That(doc, doc._id))
        })
      })
    })
  }

  static find(searchTerms, options = {}) {
    const That = this
    return new Promise((resolve, reject) => {
      this.collection.find(searchTerms, options, async (err, resources) => {
        if (err) return reject(err)
        resources = await resources.toArray()
        resources = resources.map(resource => {
          resource.id = resource._id.toString()
          return new That(resource, resource._id)
        })
        return resolve(resources)
      })
    })
  }

  /**
   * @function findOne
   * @description find a User by a specific key value, e.g., email
   * NOTE: you should index a key you expect to search by frequently on
   * the actual model.  See User as an example
   * @param {*} object {email: 'nay@test.com'}
   * @returns {Promise<Resource|Err>}
   */
  static findOne(object, options = {}) {
    const That = this
    return new Promise((resolve, reject) => {
      this.collection.findOne(object, options, (err, resource) => {
        if (err) return reject(err)
        if (!resource) return reject(new NotFoundError())
        resource.id = resource._id.toString()
        return resolve(new That(resource, resource._id))
      })
    })
  }

  static findById(id, options = {}) {
    const That = this
    return new Promise((resolve, reject) => {
      try {
        this.collection.findOne(
          { _id: ObjectId(id) },
          options,
          (err, resource) => {
            if (err) return reject(err)
            if (!resource) return reject(new NotFoundError())
            resource.id = resource._id.toString()
            return resolve(new That(resource, resource._id))
          }
        )
      } catch (error) {
        if (
          error.message ===
          'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
        ) {
          throw new NotFoundError()
        }
        throw error
      }
    })
  }

  static findByIdAndUpdate(id, payload, options = {}) {
    const That = this
    return new Promise((resolve, reject) => {
      const validationError = this.validator.validate(payload)
      if (validationError?.length) {
        return reject(new BadRequestError(validationError))
      }
      try {
        this.collection.findOneAndUpdate(
          { _id: ObjectId(id) },
          {
            $set: {
              ...payload,
              lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
            },
          },
          Object.assign(options, { returnOriginal: false }),
          (err, updatedDoc) => {
            if (err) return reject(err)
            if (
              updatedDoc?.lastErrorObject?.n === 0 &&
              updatedDoc?.lastErrorObject?.updatedExisting === false
            ) {
              return reject(new NotFoundError())
            }
            const historyDoc = Object.assign(updatedDoc.value, {
              id: ObjectId(id),
            })
            delete historyDoc._id
            this.historyCollection.insertOne(historyDoc, err2 => {
              if (err2) return reject(err2)
              updatedDoc.value.id = updatedDoc.value.id.toString()
              return resolve(new That(updatedDoc.value, updatedDoc.value._id))
            })
          }
        )
      } catch (error) {
        if (
          error.message ===
          'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
        ) {
          return reject(new NotFoundError())
        }
        return reject(error)
      }
    })
  }

  static async delete(id, options = {}) {
    try {
      const { result } = await this.collection.deleteOne(
        { _id: ObjectId(id) },
        options
      )
      if (result?.n === 0) {
        throw new NotFoundError()
      }
      return result
    } catch (error) {
      if (
        error.message ===
        'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
      ) {
        throw new NotFoundError()
      }
      throw error
    }
  }

  static validate(payload) {
    return this.validator.validate(payload)
  }

  /**
   * @function save
   * @description save on an instance of a model after validating it
   * @returns {Promise<*|error>} { n: int, nModified: int, ok: int}
   */
  save() {
    return new Promise((resolve, reject) => {
      if (!this.resource) {
        return reject(new Error('this.resource is not set.'))
      }
      if (this.resource.id) {
        this.resource.id = this.resource.id.toString()
      }
      const validationError = this.validator.validate(this.resource)
      if (validationError?.length) {
        return reject(new BadRequestError(validationError))
      }
      this.resource.lastUpdated = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ')
      this.collection.save(this.resource, (err, result) => {
        if (err) return reject(err)
        return resolve(result.result)
      })
    })
  }
}

BaseModel.db = globals.get(CLIENT_DB)

module.exports = BaseModel
