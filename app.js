var express = require('express');
var app = express();
app.use(express.static("./public"));
var request = require('request');
var cookieParser = require('cookie-parser')();
app.use(cookieParser);
var bodyParser = require('body-parser').json();
app.use(bodyParser);
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

app.get('/drop', function(req,res){
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

app.get('/spotNames', function(req,res){
  var spotName = [];
  cams.forEach(function(cam){
    spotName.push(cam.name);
  })
  res.send(spotName);
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
      userList.favorites = [];
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
        var match = false;
        for(var i=0; i<user.favorites.length; i++){
          if(user.favorites[i] == currentBreak){
            match = true;
            break;
          }
        }
        if(match == false) user.favorites.push(currentBreak);
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

app.post('/favorites/view', function(req,res){
  var currentUser = req.body.currentUser;
  var favoritesData = [];
  users.forEach(function(user){
    if(user.name.indexOf(currentUser) != -1){
      for(var i=0; i<user.favorites.length; i++){
        cams.forEach(function(cam){
          if(cam.name.indexOf(user.favorites[i]) != -1){
            var data = {};
            data.name = cam.name;
            data.shape_full = cam.shape_full;
            data.size_ft = cam.size_ft;
            data.url = cam.url;
            favoritesData.push(data);
          }
        })
      }
    }
  })
  res.send(favoritesData);
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
      var layout = {title:"Hourly UV Index for Orange County", yaxis:{title:"UV Intensity"}}
      plotly.plot(graphData, layout, function (err, msg) {
        console.log(msg.url);
        res.send(msg.url);
      })
    }
  })
})

app.get('/tide', function(req,res){
  request('http://api.spitcast.com/api/county/tide/orange-county/', function(error, response, body){
    if(!error && response.statusCode == 200){
      var data = JSON.parse(body);
      var x = [];
      var y = [];
      data.forEach(function(datum){
        x.push(datum.hour);
        y.push(datum.tide);
      })
      var graphData = [
        {
          x,
          y,
          type: "bar"
        }
      ]
      var graphOptions = {title:"Tide Height Orange County", yaxis:{title:"Height (inches)"}};
      plotly.plot(graphData, graphOptions, function (err, msg) {
        res.send(msg);
      });
    }
  })
})
var PORT = process.env.PORT || 8080;
app.listen(PORT);
