var express = require('express');
var request = require('request');
var app = express();
var cookieParser = require('cookie-parser')();
app.use(cookieParser);
var bodyParser = require('body-parser').json();
app.use(bodyParser);


var cams = require('./cams.js');

request('http://api.spitcast.com/api/county/spots/orange-county', function(error, response,body){
  if(!error && response.statusCode == 200){
    console.log("Good work");
  }
});

app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html')
});

app.get('/default.js', function(req,res){
  res.sendFile(__dirname+'/default.js')
});

app.get('/streams', function(req,res){
  var locations = [];
  cams.forEach(function(location){
    locations.push(location);
  })
  res.send(locations);
})

app.listen(8080);
