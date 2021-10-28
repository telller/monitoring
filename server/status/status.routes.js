const express = require('express')
const router = express.Router()
const statusController = require('./status.controller')

router
  .post('/', async (req, res, next) => {
    try {
      await statusController.createStatusRecord(req, res, next)
    } catch (error) {
      next(error)
    }
  })
  .get('/', async (req, res, next) => {
    try {
      await statusController.getStatus(req, res, next)
    } catch (error) {
      next(error)
    }
  })
  .get('/statistic', async (req, res, next) => {
    try {
      await statusController.getStatistic(req, res, next)
    } catch (error) {
      next(error)
    }
  })

module.exports = router
