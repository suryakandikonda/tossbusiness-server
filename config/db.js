const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

const connectDB = () => {
  try {
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message)
    // Exit process with failure
    process.exit(1)
  }
}

module.exports = connectDB