const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')
const Note = require('./models/Note')
const mongoose = require('mongoose')
require('./database/mongo')

app.use(cors())
app.use(express.json())

// app.use(logger)

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
    .then((note) => {
      if (note) res.json(note)
      res.status(404).end()
    }).catch((err) => {
      next(err)
    })
})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndDelete(id).then((del) => {
    if (!del) return res.status(404).end()
    res.status(204).end()
  }).catch(err => {
    next(err)
  })
})

app.post('/api/notes', (req, res) => {
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
    console.error(err)
  })
})

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found'
  })
})

app.use((err, req, res, next) => {
  console.error(err)
  if (err.name === 'CastError') res.status(400).send({ error: 'malformed id' })
  res.status(500).end()
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
