function swap(showPage, hidePage){
  hidePage.className += ' hidden ';
  showPage.className = showPage.className.replace(/hidden/g, " ");
}

// function makeMap(location){
//   var newMap = document.getElementById('map');
//   var map = new google.maps.Map(newMap, {
//     center: {lat: location.latitude, lng: location.longitude},
//     zoom: 8
//   });
// };

document.addEventListener('load', function(e){
  var xhr = new XMLHttpRequest();
  xhr.open('GET','/');
  xhr.setRequestHeader('Content-type','application/json');
  xhr.send();

  xhr.addEventListener('load', function(){
    var frame = document.getElementById('homeFrame');
    frame.setAttribute('src',location.url);
  })
});

var searchButton = document.getElementById('searchButton');
var search = document.getElementById('search');
var homePage = document.getElementById('homePage');
var resultsPage = document.getElementById('resultsPage');

searchButton.addEventListener('click', function(e){
  var xhr = new XMLHttpRequest();
  xhr.open('GET','/streams');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(search.value);

  xhr.addEventListener("load",function(){
    var response = JSON.parse(xhr.responseText);

    response.forEach(function(location){
      if(location.name.toLowerCase().indexOf(search.value.toLowerCase())!==-1 && search.value.length>1){
        var stream = document.getElementById('stream');
        var frame = document.getElementById('frame');
        frame.setAttribute('src',location.url);
        var homeFrame = document.getElementById('homeFrame');
        homeFrame.setAttribute('src',location.url);
        var homeFrameText = document.getElementById('homeFrameText');
        homeFrameText.textContent = "Your daily cam: "+location.name;
        homeFrameText.setAttribute('align','center');
        var streamTitle = document.getElementById('streamTitle');
        streamTitle.textContent = location.name;
        var spotSize = document.getElementById('spotSize');
        spotSize.textContent = "Wave height: "+Math.floor(location.size_ft)+"-"+Math.ceil(location.size_ft) + " ft";
        if(location.size<3){
          spotSize.style.color = 'green';
        }
        else if(location.size>=3 && location.size<6){
          spotSize.style.color = 'orange';
        }
        else{
          spotSize.style.color = 'red';
        }
        var spotConditions = document.getElementById('spotConditions');
        spotConditions.textContent = "Conditions: "+location.shape_full;
        swap(resultsPage, homePage);
        // makeMap(location);
      }
    })
  })
});

var returnHome = document.getElementById('spotTitle');
returnHome.addEventListener('click', function(e){
  swap(homePage, resultsPage);
})

var loginReturn = document.getElementById('loginTitle');
loginReturn.addEventListener('click', function(e){
  swap(homePage, loginPage);
})

var login = document.getElementById('login');
login.addEventListener('click', function(e){
  swap(loginPage, homePage);
})

var login2 = document.getElementById('login2');
login2.addEventListener('click', function(e){
  swap(loginPage, resultsPage);
})

var returnToLogin = document.getElementById('returnToLogin');
returnToLogin.addEventListener('click', function(e){
  swap(loginPage, createAccountPage);
})

var returnToLogin2 = document.getElementById('returnToLogin2');
returnToLogin2.addEventListener('click', function(e){
  swap(loginPage, createAccountPage);
})

var returnToLogin3 = document.getElementById('createAccountTitle');
returnToLogin3.addEventListener('click', function(e){
  swap(homePage, createAccountPage);
})

var createAccountButton1 = document.getElementById('createAccountButton1');
createAccountButton1.addEventListener('click', function(e){
  swap(createAccountPage, loginPage);
})

var createAccountButton2 = document.getElementById('createAccountButton2');
createAccountButton2.addEventListener('click', function(e){
  swap(createAccountPage, loginPage);
})

var createAccountButton = document.getElementById('createAccountButton');
createAccountButton.addEventListener('click',function(e){
  var setUserName = document.getElementById('setUserName').value;
  var setUserUsername = document.getElementById('setUserUsername').value;
  var setUserEmail = document.getElementById('setUserEmail').value;
  var setUserPassword = document.getElementById('setUserPassword').value;

  var data = {
    "name":setUserName, "username":setUserUsername, "email":setUserEmail, "password":setUserPassword, "id":new Date().getTime()
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST','/createAccount/:username/');
  xhr.setRequestHeader('Content-type','application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function(e){
    var response = JSON.parse(xhr.responseText);
    var usernameInput = document.getElementById('usernameInput');
    if(response == true){
      usernameInput.textContent = "Username - that username is already in use";
      usernameInput.className = 'invalid';
    }
    else if(response == false){
      usernameInput.textContent = "Username";
      usernameInput.className = 'valid';
      login = document.getElementById('login');
      logout = document.getElementById('logout');
      swap(logout, login);

      login2 = document.getElementById('login2');
      logout2 = document.getElementById('logout2');
      swap(logout2, login2);

      greetUser = document.getElementById('greetUser');
      greetUser2 = document.getElementById('greetUser2');
      var str = data.name;
      var index = data.name.indexOf(" ");
      greetUser.textContent = "Welcome, "+str.slice(0,index);
      greetUser2.textContent = "Welcome, "+str.slice(0,index);
      swap(homePage,createAccountPage);
    }
    else{
      usernameInput.textContent = "Username";
      usernameInput.className = 'neutral';
    }
  })
})

var signInButton = document.getElementById('signInButton');
signInButton.addEventListener('click', function(e){
  var userName = document.getElementById('signInUsername');
  var password = document.getElementById('signInPassword');
  var data = {
    "username":userName.value, "password":password.value
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST','/login/:username/:password');
  xhr.setRequestHeader('Content-type','application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load',function(e){
    console.log(xhr.responseText);
    if(xhr.status == 401){
      signInButton.className = 'btn btn-danger';
      signInButton.textContent = 'INVALID USERNAME/PASSWORD';
    }
    else{
      login = document.getElementById('login');
      logout = document.getElementById('logout');
      swap(logout, login);

      login2 = document.getElementById('login2');
      logout2 = document.getElementById('logout2');
      swap(logout2, login2);

      greetUser = document.getElementById('greetUser');
      greetUser2 = document.getElementById('greetUser2');
      var str = xhr.responseText;
      var index = str.indexOf(" ");
      greetUser.textContent = "Welcome, "+str.slice(0,index);
      greetUser2.textContent = "Welcome, "+str.slice(0,index);
      swap(homePage, loginPage);
    }
  })
})
var logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', function(e){
  login = document.getElementById('login');
  logout = document.getElementById('logout');
  swap(login, logout);

  login2 = document.getElementById('login2');
  logout2 = document.getElementById('logout2');
  swap(login2, logout2);

  greetUser = document.getElementById('greetUser');
  greetUser2 = document.getElementById('greetUser2');
  greetUser.textContent = '';
  greetUser2.textContent = '';
  swap(homePage, loginPage);
})

var logoutButton2 = document.getElementById('logout2');
logoutButton2.addEventListener('click', function(e){
  login = document.getElementById('login');
  logout = document.getElementById('logout');
  swap(login, logout);

  login2 = document.getElementById('login2');
  logout2 = document.getElementById('logout2');
  swap(login2, logout2);

  greetUser = document.getElementById('greetUser');
  greetUser2 = document.getElementById('greetUser2');
  greetUser.textContent = '';
  greetUser2.textContent = '';
  swap(homePage, resultsPage);
})
