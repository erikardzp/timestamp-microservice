
const dotenv = require("dotenv");
dotenv.config();
// import mongoose package
const mongoose = require('mongoose')

// establishing a database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const connection = mongoose.connection

// export the connection object
module.exports = connection

