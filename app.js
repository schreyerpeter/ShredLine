var express = require('express');
var request = require('request');
var app = express();
var cookieParser = require('cookie-parser')();
app.use(cookieParser);
var bodyParser = require('body-parser').json();
app.use(bodyParser);

app.use(express.static("Pictures"));
var moment = require('moment');

var plotly = require('plotly')("pschreyer", "ysr8lsaz99");

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
  var people = [];
  var data = {locations,people};
  cams.forEach(function(location){
    locations.push(location);
  })
  users.forEach(function(user){
    people.push(user);
  })
  res.send(data);
})

app.post('/createAccount/:username/', function(req,res){
  var matched = false;
  users.forEach(function(user){
    if(req.params.username == user.username || req.body.username == user.username){
      matched = true;
    }
    if (matched == false){
      var userList = {};
      userList.name = req.body.name;
      userList.username = req.body.username;
      userList.email = req.body.email;
      userList.password = req.body.password;
      userList.id = req.body.id;
      users.push(userList);
    }
  })
  res.send(matched);
})

// app.use(function(req,res,next){
//   users.forEach(function(user){
//     if(user.username == req.params.username && user.password == req.params.password || req.body.username == user.username && req.body.password == user.password){
//       console.log(user);
//       next();
//     }
//     else(res.sendStatus(401));
//     console.log(JSON.stringify(req.params));
//     console.log(req.body);
//   })
// })

app.post('/login/:username/:password', function(req,res){
  var currentUser;
  users.forEach(function(user){
    if(req.body.username == user.username && req.body.password == user.password || req.params.username == user.username && req.params.password == user.password){
      currentUser = user.name;
    }
  })
  if(currentUser != undefined){
    res.send(currentUser);
  }
  else res.sendStatus(401);
});

app.post('/favorites/add/:location', function(req,res){
  var currentUser = req.body.currentUser;
  var currentBreak = req.body.currentBreak;
  users.forEach(function(user){
    if(user.name.indexOf(currentUser) != -1){
      if(user.favorites.length == 0){
        user.favorites.push(currentBreak);
      }
      else{
        for(var i=0; i<user.favorites.length; i++){
          if(user.favorites[i].indexOf(currentBreak) == -1){
            user.favorites.push(currentBreak)
          }
        }
      }
    }
  })
  res.send();
})

app.delete('/favorites/remove/:location', function(req,res){
  var currentUser = req.body.currentUser;
  var currentBreak = req.body.currentBreak;
  users.forEach(function(user){
    if(user.name.indexOf(currentUser) != -1){
      for(var i=0; i<user.favorites.length; i++){
        if(user.favorites[i].indexOf(currentBreak) != -1){
          user.favorites.splice(i,1)
        }
      }
    }
  })
  res.send();
})

app.get('/time', function(req,res){
  var time = moment().format('MMMM Do YYYY, h:mm:ss a');
  res.send(time);
})

app.get('/uv', function(req,res){
  request('https://iaspub.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/ZIP/92625/JSON', function(error, response, body){
    if(!error && response.statusCode == 200){
      var data = JSON.parse(body);
      var x = [];
      var y = [];
      data.forEach(function(datum){
        var index = datum.DATE_TIME.indexOf(' ');
        datum.DATE_TIME = datum.DATE_TIME.slice(index);
        x.push(datum.DATE_TIME);
        y.push(datum.UV_VALUE);
      })
      var graphData = [
        {
          x,
          y,
          type: "scatter"
        }
      ];
      var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
      plotly.plot(graphData, graphOptions, function (err, msg) {
        console.log(msg.url);
        res.send(msg.url);
      })
    }
  })
})

app.listen(8080);
