const Sentry = require('@sentry/node')
const express = require('express')
const cors = require('cors')
const logger = require('./middlewares/logger')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')
const Note = require('./models/Note')
require('./database/mongo')

const app = express()

Sentry.init({
  dsn: 'https://01f759a9e3ab4691a7096cc0b24e482b@o4505486909177856.ingest.sentry.io/4505486911668224',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()
  ],

  tracesSampleRate: 1.0
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.use(cors())
app.use(express.json())

app.use(logger)

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res, next) => {
  Note.find({}).then(notes => {
    res.json(notes)
  }).catch(() => {
    res.status(404).end()
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id)
    .then(note => {
      if (note) res.json(note)
      res.status(404).end()
    }).catch(err => {
      next(err)
    })
})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndDelete(id).then(del => {
    if (!del) return res.status(404).end()
    res.status(204).end()
  }).catch(err => {
    next(err)
  })
})

app.post('/api/notes', (req, res, next) => {
  const { content, important } = req.body
  if (!content) {
    return res.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const note = new Note({ content, date: new Date(), important: important ?? false })
  note.save().then(savedNote => {
    res.json(savedNote)
  }).catch(err => {
    next(err)
  })
})

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  Note.findByIdAndUpdate(id, note, { new: true }).then(updatedNote => {
    res.json(updatedNote)
  }).catch(err => {
    next(err)
  })
})

app.use(notFound)
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
