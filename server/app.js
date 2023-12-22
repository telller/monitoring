const cors = require('cors')
const express = require('express')

const errorHandler = require('./utils/error-handler')

/** Routes */
const statusRoutes = require('./status/status.routes')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(timezone)
dayjs.extend(utc)

function init(callbackHandler) {
  const app = express()
  app.use(express.json())

  app.get('/healthcheck', cors(), (_, res) => {
    res.status(200).send('ok')
  })

  app.use('/status', statusRoutes)

  app.get('*', (req, res) => {
    return callbackHandler(req, res)
  })

  app.use(errorHandler)
  return app
}

module.exports = init
