const dbConfig = {
  connection:
    process.env.MONGO_URL ||
    `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}`,
  db_name: process.env.MONGO_DB_NAME,
  options: {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
  },
  generateConnectionString: function () {
    // if (!this.connection || !this.db_name) {
    //   console.warn('db.config needs both connection string and db_name')
    //   return null
    // }
    //
    // if (process.env.NODE_ENV === 'production') {
    //   return this.connection.replace(':27017/', `:27017/${this.db_name}`)
    // } else {
    //   return `${this.connection}/${this.db_name}`
    // }

    return `mongodb://teller_admin:teller_admin@${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}?authSource=admin`
  },
}

module.exports = dbConfig
