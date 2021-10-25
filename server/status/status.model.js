const statusValidator = require('./status.validator')
const eventEmitter = require('../utils/event-emitter')
const { COLLECTION } = require('../utils/constants')
const BaseModel = require('../utils/base.model')

class StatusModel extends BaseModel {
  constructor(resource, _id) {
    super(COLLECTION.STATUS, statusValidator)
    this.resource = resource
    this._id = _id
  }
}

StatusModel.collectionName = COLLECTION.STATUS
StatusModel.validator = statusValidator

eventEmitter.on('mongoconnect', async () => {
  try {
    StatusModel.initialize()
  } catch (error) {
    console.error(`[StatusModel] - Failed to create index ${error}`)
    throw error
  }
})

module.exports = StatusModel
