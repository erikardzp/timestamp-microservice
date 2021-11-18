// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

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


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
  console.log({greeting: 'hello API'});
});

app.get("/api/:date", function (req, res) {

  let date = req.params.date;
  
  if(parseInt(date) > 10000) {
    let unixtime = new Date(parseInt(date));
    res.json({"unix": unixtime.getTime(), "utc": unixtime.toUTCString()}
    );
  }

  let passedValue = new Date(date);
  
  if (passedValue == "Invalid Date" )
    res.json({ error : "Invalid Date" });
  else{
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
