module.exports = function errorHandler(err, req, res, next) {
  if (err) {
    console.error(err)
    res
      .status(err.status || 500)
      .json({ error: 'Something went wrong', message: err })
  } else {
    next()
  }
}
