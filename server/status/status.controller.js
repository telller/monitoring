const Status = require('./status.model')

module.exports = {
  createStatusRecord: async (req, res, next) => {
    try {
      const result = await Status.create(req.body)
      return res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  },
  getStatus: async (req, res, next) => {
    try {
      const result = await Status.find()
      return res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  },
}
