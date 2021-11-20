const mongoose = require('mongoose')

// instantiate a mongoose schema
const exerciseSchema = new mongoose.Schema({
    description: String,
    duration: String,
    date: {
        type: String,
        default: Date.now
    }
})

// create a model from schema and export it
module.exports = mongoose.model('Exercise', exerciseSchema)