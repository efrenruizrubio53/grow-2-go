const handleErrors = (err, req, res, next) => {
  console.error(err)
  if (err.name === 'CastError') res.status(400).send({ error: 'malformed id' })
  res.status(500).end()
}

module.exports = handleErrors
