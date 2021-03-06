const { BadRequestError } = require('../utils/http-errors')
const { meanBy, get } = require('lodash')
const Status = require('./status.model')
const moment = require('moment')

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
      const result = await Status.create(obj)
      return res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  },
  getStatus: async (req, res, next) => {
    try {
      const { from, to } = req.query
      if (!from || !to) {
        throw new BadRequestError('Please provide "from" and "to" parameters')
      }
      const result = await Status.find({
        createdAt: {
          $gte: moment(from).toISOString(),
          $lt: moment(to).toISOString(),
        },
      })
      return res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  },
  getStatistic: async (req, res, next) => {
    try {
      const { from, to } = req.query
      if (!from || !to) {
        throw new BadRequestError('Please provide "from" and "to" parameters')
      }
      const result = await Status.find({
        createdAt: {
          $gte: moment(from).toISOString(),
          $lt: moment(to).toISOString(),
        },
      })
      return res.status(200).json({
        volatileOrganicCompounds: getAverage(
          result,
          'volatileOrganicCompounds'
        ),
        carbonDioxide: getAverage(result, 'carbonDioxide'),
        temperature: getAverage(result, 'temperature'),
        humidity: getAverage(result, 'humidity'),
      })
    } catch (error) {
      next(error)
    }
  },
}

function getAverage(arr, field) {
  const res = meanBy(arr, field)
  return res ? +res.toFixed() : 0
}
