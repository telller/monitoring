const Status = require('./status.model')
const { get } = require('lodash')

module.exports = {
  createStatusRecord: async (req, res, next) => {
    try {
      let obj = { ...req.body }
      Object.keys(req.body).forEach(key => {
        if (key !== 'dateTime') {
          obj = {
            ...obj,
            [key]: +get(req.body, key, 0).toFixed(2),
          }
        }
      })
      console.log({ obj, body: req.body })
      const result = await Status.create(obj)
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
