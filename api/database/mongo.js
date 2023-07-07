const mongoose = require('mongoose')
require('dotenv').config()

const MONGO_DB_URI = `mongodb+srv://eruiz:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_NAME}.w6gn97j.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(MONGO_DB_URI).then(() => {
  console.log('Database connected')
}).catch(error => {
  console.error(error)
})
