const Status = require('./status.model')

module.exports = {
  getUsers: async (req, res, next) => {
    try {
      const result = await Status.find({})
      console.log({ result })
      return res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  },
  createUser: async (req, res, next) => {
    try {
      const result = await Status.create(req.body)
      return res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  },
}
