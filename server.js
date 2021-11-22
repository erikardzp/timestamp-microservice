// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const bodyParser = require("body-parser");
var port = process.env.PORT || 3000;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// Database Config
const connection = require('./db.config')
connection.once('open', () => console.log('DB Connected'))
connection.on('error', () => console.log('Error'))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// import the models of our database model
const User = require('./models/userModel');

const Exercise = require('./models/ExerciseModel');
// Routes Config
app.use(express.json({
  extended: false
})) 
//Parse incoming request body in JSON format.
app.use('/api/shorturl', require('./routes/redirect'))
app.use('/api', require('./routes/url'))

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/timestamp", function (req, res) {
  res.sendFile(__dirname + '/views/timestamp.html');
});

app.get("/requestHeader", function (req, res) {
  res.sendFile(__dirname + '/views/requestHeader.html');
});

app.get("/urlShortener", function (req, res) {
  res.sendFile(__dirname + '/views/urlShortener.html');
});

app.get("/exerciseTracker", function (req, res) {
  res.sendFile(__dirname + '/views/exerciseTracker.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
  console.log({greeting: 'hello API'});
});

//Exercise Tracker... 
app.post("/api/users", function (req, res) {

  let username = req.body.username;

  username = new User({username});
  username.save();
  res.json({username: username.username, _id:username._id});
});

app.get("/api/users", async function (req, res) {

  let all = await User.find({}).exec();
  res.json(all);
});

app.post("/api/users/:_id/exercises", bodyParser.urlencoded({extended: false}), function (req, res) {

  let id = req.params._id
  let exerciseModel = new Exercise({
    description : req.body.description, 
    duration: parseInt(req.body.duration), 
    date: req.body.date
  })

  if (exerciseModel.date ===''){
    exerciseModel.date = new Date().toISOString().substring(0,10);
  }

  User.findByIdAndUpdate(id, 
    {$push: {log: exerciseModel}}, 
    {new: true},
    function(err, updatedUser){
      if (err) return console.error(err);
      let resObject = {}
      resObject['username'] = updatedUser.username,
      resObject['description'] = exerciseModel.description,
      resObject['duration'] = exerciseModel.duration,
      resObject['date'] = new Date(exerciseModel.date).toDateString(),
      resObject['_id'] = updatedUser._id
      res.json(resObject);
    }
  )
  
});

app.get("/api/users/:_id/logs", function(req, res){

  let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  res.json({
            "ipaddress": ip, "language": req.headers["accept-language"], "software": req.headers["user-agent"]
          });
});

//Request Header Parser API endpoint...
app.get("/api/whoami", function(req, res){

  let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  res.json({
            "ipaddress": ip, "language": req.headers["accept-language"], "software": req.headers["user-agent"]
          });
});

// Timestamp API endpoint... 
app.get("/api/:date", function (req, res) {

  let date = req.params.date;
  
  if(parseInt(date) > 10000) {
    let unixtime = new Date(parseInt(date));
    res.json({"unix": unixtime.getTime(), "utc": unixtime.toUTCString()}
    );
  }

  let passedValue = new Date(date);
  
  if (passedValue == "Invalid Date" ){
      res.json({ error : "Invalid Date" });
  }else{
    res.json({"unix": passedValue.getTime(), "utc": passedValue.toUTCString()}
    );
  }      
});

app.get("/api", function (req, res) {

  let date =   new Date();  
  res.json({"unix": date.getTime(), "utc": date.toUTCString()}
    ); 
});



// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
