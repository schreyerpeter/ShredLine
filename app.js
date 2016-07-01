var express = require('express');
var request = require('request');
var app = express();
var cookieParser = require('cookie-parser')();
app.use(cookieParser);
var bodyParser = require('body-parser').json();
app.use(bodyParser);

app.use(express.static("Pictures"));

var cams = require('./cams.js');
var users = require('./users.js');

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
            spot.size_ft = entry.size_ft;
            spot.latitude = entry.latitude;
            spot.longitude = entry.longitude;
          }
        })
      }
    });
  })
  // cams.forEach(function(spot){
  //   request()
  // }) NEED TO INCLUDE WIND AND WATER TEMP FOR OC ON HOMEPAGE
});



app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html')
});

app.get('/default.css', function(req,res){
  res.sendFile(__dirname+'/default.css')
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

app.post('/createAccount/:username/', function(req,res){
  var matched = false;
  users.forEach(function(user){
    if(req.params.username == user.username || req.body.username == user.username){
      matched = true;
      console.log('Match');
    }
    if (matched == false){
      var userList = {};
      userList.name = req.body.name;
      userList.username = req.body.username;
      userList.email = req.body.email;
      userList.password = req.body.password;
      userList.id = req.body.id;
      console.log('No match');
      users.push(userList);
    }
  })
  res.send(matched);
})

app.use(function(req,res,next){
  users.forEach(function(user){
    if(user.username == req.params.username && user.password == req.params.password || req.body.username == user.username && req.body.password == user.password){
      next();
    }
    else(res.sendStatus(401));
  })
})

app.post('/login/:username/:password', function(req,res){
  var currentUser;
  users.forEach(function(user){
    if(req.body.username == user.username){
      currentUser = user.name;
    }
  })
  res.send(currentUser);
});

app.post('/favorites/add/:location', function(req,res){
  var currentUser = req.params.location;
  var currentBreak;
  JSON.parse(req.body);
  console.log(req.body);
  users.forEach(function(user){
    console.log(user);
  })
  res.send();
})
app.listen(8080);
