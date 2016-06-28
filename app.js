var express = require('express');
var request = require('request');
var app = express();
var cookieParser = require('cookie-parser')();
app.use(cookieParser);
var bodyParser = require('body-parser').json();
app.use(bodyParser);


var cams = require('./cams.js');

request('http://api.spitcast.com/api/spot/all', function(error, response,body){
  if(!error && response.statusCode == 200){
    var info = JSON.parse(body);
    info.forEach(function(location){
      cams.forEach(function(spot){
        if(location.spot_name == spot.name){
          spot.id = location.spot_id;
          spot.conditionURL = "http://api.spitcast.com/api/spot/forecast/"+spot.id+"/";
        }
      })
    })
  };
  cams.forEach(function(spot){
    request(spot.conditionURL, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        data.forEach(function(entry){
          if(entry.spot_id == spot.id){
            spot.date = entry.date;
            spot.shape_detail = entry.shape_detail;
            spot.shape_full = entry.shape_full;
            spot.size = entry.size;
          }
        })
        console.log(cams);
      }
    });
  })
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
