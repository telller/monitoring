const next = require('next')
const { createHttpTerminator } = require('http-terminator')
// const { MongoClient } = require('mongodb')
// const dbConfig = require('./config/db.config')
// const globals = require('./server/utils/globals')
// const eventEmitter = require('./server/utils/event-emitter')
// const { CLIENT, CLIENT_DB } = require('./server/utils/constants')

const init = require('./server/app')

const PORT = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApplication = next({ dev })
const handle = nextApplication.getRequestHandler()

nextApplication
  .prepare()
  .then(async () => {
    await new Promise(resolve => {
      // MongoClient.connect(
      //   dbConfig.generateConnectionString(),
      //   dbConfig.options,
      //   (err, client) => {
      //     if (err) {
      //       console.error(err.message)
      //       throw err
      //     }
      //     const dbName = client.s.options.dbName
      //     const res = {
      //       [CLIENT]: client,
      //       [CLIENT_DB]: client.db(dbName),
      //     }
      //     globals.set(CLIENT, client)
      //     globals.set(CLIENT_DB, client.db(dbName))
      //     eventEmitter.emit('mongoconnect', res)
      //     resolve(res)
      //   }
      // )
      resolve()
    })
    const app = init(handle)

    const server = app.listen(PORT, err => {
      if (err) throw err
      console.info(`Starting on ${PORT}`)
    })

    const httpTerminator = createHttpTerminator({
      server,
      gracefulTerminationTimeout: 30000,
    })

    process.on('SIGTERM', async function onSigterm() {
      console.info('Beginning shutdown of server')
      try {
        await httpTerminator.terminate()
        console.info('Successfully shut down server')
        process.exit(0)
      } catch (error) {
        console.error('Failed to shutdown server: ', error)
        process.exit(1)
      }
    })
  })
  .catch(err => {
    console.error('Error Starting Server: ', err)
    process.exitCode = 1
  })
