const express = require('express')
const router = express.Router()
const statusController = require('./status.controller')

router
  .post('/', async (req, res, next) => {
    try {
      await statusController.createUser(req, res, next)
    } catch (error) {
      next(error)
    }
  })
  .get('/', async (req, res, next) => {
    try {
      await statusController.getUsers(req, res, next)
    } catch (error) {
      next(error)
    }
  })

module.exports = router
