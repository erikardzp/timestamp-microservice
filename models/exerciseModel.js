const mongoose = require('mongoose')

// instantiate a mongoose schema
const ExcerciseSchema = new mongoose.Schema({
    description: { type: String, require: true},
    duration: { type: Number, require: true},
    date: { type: String, requere: false}
})

// create a model from schema and export it
module.exports = mongoose.model('Exercise', ExcerciseSchema)