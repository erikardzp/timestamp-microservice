const mongoose = require('mongoose')

// instantiate a mongoose schema
const userSchema = new mongoose.Schema({
    username: String
})

// create a model from schema and export it
module.exports = mongoose.model('User', userSchema)