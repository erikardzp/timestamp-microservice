const mongoose = require('mongoose')
const ExerciseSchema = require('./exerciseModel').schema;

// instantiate a mongoose schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    log: [ExerciseSchema]
})

// create a model from schema and export it
module.exports = mongoose.model('User', userSchema)