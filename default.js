var currentUser = '';
var homePage = document.getElementById('home-page');
var resultsPage = document.getElementById('results-page');
var loginPage = document.getElementById('login-page');
var createAccountPage = document.getElementById('create-account-page');
var favoritesPage = document.getElementById('favorites-page');

function clear(element){
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function swap(showPage, hidePage){
  hidePage.className += ' hidden ';
  showPage.className = showPage.className.replace(/hidden/g, " ");
}

function initMap(location) {
  var myPosition = {lat: location.latitude, lng: location.longitude};
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myPosition,
    scrollwheel: false,
    zoom: 14
  });
  var marker = new google.maps.Marker({
    map: map,
    position: myPosition,
    title: 'Shred Here'
  });
}
//Show Time on Page
setInterval(function showTime(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET','/time');
  xhr.setRequestHeader('Content-type','application/json');
  xhr.send();

  xhr.addEventListener('load', function(e){
    time.textContent = xhr.responseText;
  })
  carousel.appendChild(time);
}, 999);

//Show UV index graph
function showUV(){
  var uvDiv = document.getElementById('uv-plot');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/uv');
  xhr.setRequestHeader('Content-type','application/json');
  xhr.send();

  xhr.addEventListener('load', function(e){
    var data = xhr.responseText;
  })
}

//Show tide graph
function tide(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET",'/tide');
  xhr.setRequestHeader('Content-type','application/json');
  xhr.send();

  xhr.addEventListener('load', function(e){
    var data = xhr.responseText;
    console.log(data);
  })
}

document.addEventListener('load', function(e){
  var xhr = new XMLHttpRequest();
  xhr.open('GET','/');
  xhr.setRequestHeader('Content-type','application/json');
  xhr.send();

  xhr.addEventListener('load', function(){
    var frame = document.getElementById('home-frame');
    frame.setAttribute('src',location.url);
  })
});

var breakDrop = document.getElementById('break-drop');
var breakDropList = document.getElementById('break-drop-list');
breakDrop.addEventListener('click',function(e){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/spotNames');
  xhr.setRequestHeader('Content-type','application/json');
  xhr.send();

  xhr.addEventListener('load',function(){
    while(breakDropList.children.length>2){
      breakDropList.removeChild(breakDropList.thirdChild)
    }
    var names = JSON.parse(xhr.responseText);
    for (var i = 0; i < names.length; i++) {
      var newSpot = document.createElement('li');
      var newSpotName = document.createElement('a');
      newSpotName.textContent = names[i];
      newSpot.appendChild(newSpotName);
      breakDropList.appendChild(newSpot);
    }
  })
})

breakDropList.addEventListener('click', function(e){
  var xhr = new XMLHttpRequest();
  xhr.open('GET','/drop');
  xhr.setRequestHeader('Content-type', 'application/json');
  var searchValue = e.target.textContent;
  xhr.send();

  xhr.addEventListener("load",function(){
    var response = JSON.parse(xhr.responseText);
    response.locations.forEach(function(location){
      if(searchValue == location.name){
        currentBreak = location.name;
        var stream = document.getElementById('stream');
        var frame = document.getElementById('frame');
        frame.setAttribute('src',location.url);
        var homeFrame = document.getElementById('home-frame');
        homeFrame.setAttribute('src',location.url);
        var homeFrameText = document.getElementById('home-frame-text');
        homeFrameText.textContent = "Your most recently viewed cam: "+location.name;
        homeFrameText.setAttribute('align','center');
        var streamTitle = document.getElementById('stream-title');
        streamTitle.textContent = location.name;
        var spotSize = document.getElementById('spot-size');
        spotSize.textContent = "Wave height: "+Math.floor(location.size_ft)+"-"+Math.ceil(location.size_ft) + " ft";
        if(location.size<3){
          spotSize.style.backgroundColor = 'green';
          spotSize.style.color = 'white';
        }
        else if(location.size>=3 && location.size<6){
          spotSize.style.backgroundColor = 'orange';
          spotSize.style.color = 'white';
        }
        else{
          spotSize.style.backgroundColor = 'red';
          spotSize.style.color = 'white';
        }
        var spotConditions = document.getElementById('spot-conditions');
        spotConditions.textContent = "Conditions: "+location.shape_full;
        if(location.shape_full == "Poor"){
          spotConditions.style.backgroundColor = 'red';
          spotConditions.style.color = 'white';
        }
        else if(location.shape_full == "Poor-Fair"){
          spotConditions.style.backgroundColor = 'orange';
          spotConditions.style.color = 'white';

        }
        else if(location.shape_full == "Fair"){
          spotConditions.style.backgroundColor = 'blue';
          spotConditions.style.color = 'white';
        }
        else{
          spotConditions.style.backgroundColor = 'green';
          spotConditions.style.color = 'white';
        }
        swap(resultsPage, homePage);
        var removeFromFavorites = document.getElementById('remove-from-favorites');
        var addToFavorites = document.getElementById('add-to-favorites');
        currentUser = document.getElementById('greet-user').textContent;
        var index = currentUser.indexOf(' ');
        currentUser = currentUser.slice(index+1);

        response.people.forEach(function(person){
          if(person.name.indexOf(currentUser)!= -1){
            for(var i=0; i<person.favorites.length; i++){
              if(person.favorites[i] == location.name){
                swap(removeFromFavorites, addToFavorites);
                break;
              }
              else swap(addToFavorites,removeFromFavorites);
            }
          }
        })
        initMap(location);
      }
    })
  })
})

var currentBreak;
var searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', function(e){
  var xhr = new XMLHttpRequest();
  xhr.open('GET','/streams');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(search.value);

  xhr.addEventListener("load",function(){
    var response = JSON.parse(xhr.responseText);
    console.log(response);

    response.locations.forEach(function(location){
      if(location.name.toLowerCase().indexOf(search.value.toLowerCase())!==-1 && search.value.length>1){
        currentBreak = location.name;
        var stream = document.getElementById('stream');
        var frame = document.getElementById('frame');
        frame.setAttribute('src',location.url);
        var homeFrame = document.getElementById('home-frame');
        homeFrame.setAttribute('src',location.url);
        var homeFrameText = document.getElementById('home-frame-text');
        homeFrameText.textContent = "Your most recently viewed cam: "+location.name;
        homeFrameText.setAttribute('align','center');
        var streamTitle = document.getElementById('stream-title');
        streamTitle.textContent = location.name;
        var spotSize = document.getElementById('spot-size');
        spotSize.textContent = "Wave height: "+Math.floor(location.size_ft)+"-"+Math.ceil(location.size_ft) + " ft";
        if(location.size<3){
          spotSize.style.backgroundColor = 'green';
          spotSize.style.color = 'white';
        }
        else if(location.size>=3 && location.size<6){
          spotSize.style.backgroundColor = 'orange';
          spotSize.style.color = 'white';
        }
        else{
          spotSize.style.backgroundColor = 'red';
          spotSize.style.color = 'white';
        }
        var spotConditions = document.getElementById('spot-conditions');
        spotConditions.textContent = "Conditions: "+location.shape_full;
        if(location.shape_full == "Poor"){
          spotConditions.style.backgroundColor = 'red';
          spotConditions.style.color = 'white';
        }
        else if(location.shape_full == "Poor-Fair"){
          spotConditions.style.backgroundColor = 'orange';
          spotConditions.style.color = 'white';

        }
        else if(location.shape_full == "Fair"){
          spotConditions.style.backgroundColor = 'blue';
          spotConditions.style.color = 'white';
        }
        else{
          spotConditions.style.backgroundColor = 'green';
          spotConditions.style.color = 'white';
        }
        swap(resultsPage, homePage);
        // makeMap(location);
        var removeFromFavorites = document.getElementById('remove-from-favorites');
        var addToFavorites = document.getElementById('add-to-favorites');
        currentUser = document.getElementById('greet-user').textContent;
        var index = currentUser.indexOf(' ');
        currentUser = currentUser.slice(index+1);

        response.people.forEach(function(person){
          if(person.name.indexOf(currentUser)!= -1){
            for(var i=0; i<person.favorites.length; i++){
              if(person.favorites[i] == location.name){
                swap(removeFromFavorites, addToFavorites);
                break;
              }
              else swap(addToFavorites,removeFromFavorites);
            }
          }
        })
        initMap(location);
      }
    })
  })
});

var returnHome = document.getElementById('spot-title');
returnHome.addEventListener('click', function(e){
  swap(homePage, resultsPage);
})

var returnHome2 = document.getElementById('spot-title-2');
returnHome2.addEventListener('click', function(e){
  swap(homePage, favoritesPage);
})

var loginReturn = document.getElementById('login-title');
loginReturn.addEventListener('click', function(e){
  swap(homePage, loginPage);
})

var login = document.getElementById('login');
login.addEventListener('click', function(e){
  swap(loginPage, homePage);
})

var login2 = document.getElementById('login-2');
login2.addEventListener('click', function(e){
  swap(loginPage, resultsPage);
})

var returnToLogin = document.getElementById('return-to-login');
returnToLogin.addEventListener('click', function(e){
  var userNameInput = document.getElementById('user-name-input');
  userNameInput.className += " neutral ";
  userNameInput.textContent = 'Full Name';
  var userEmailInput = document.getElementById('user-email-input');
  userEmailInput.className += " neutral ";
  userEmailInput.textContent = 'Email';
  var userPasswordInput = document.getElementById('user-password-input');
  userPasswordInput.className += " neutral ";
  userPasswordInput.textContent = 'Password';
  var setUserName = document.getElementById('set-user-name').value;
  var setUserUsername = document.getElementById('set-user-username').value;
  var setUserEmail = document.getElementById('set-user-email').value;
  var setUserPassword = document.getElementById('set-user-password').value;
  setUserName = '';
  setUserUsername = '';
  setUserEmail = '';
  setUserPassword = '';
  usernameInput.textContent = "Username";
  usernameInput.className = 'neutral';
  swap(loginPage, createAccountPage);
})

var returnToLogin2 = document.getElementById('return-to-login-2');
returnToLogin2.addEventListener('click', function(e){
  var userNameInput = document.getElementById('user-name-input');
  userNameInput.className += " neutral ";
  userNameInput.textContent = 'Full Name';
  var userEmailInput = document.getElementById('user-email-input');
  userEmailInput.className += " neutral ";
  userEmailInput.textContent = 'Email';
  var userPasswordInput = document.getElementById('user-password-input');
  userPasswordInput.className += " neutral ";
  userPasswordInput.textContent = 'Password';
  var setUserName = document.getElementById('set-user-name').value;
  var setUserUsername = document.getElementById('set-user-username').value;
  var setUserEmail = document.getElementById('set-user-email').value;
  var setUserPassword = document.getElementById('set-user-password').value;
  setUserName = '';
  setUserUsername = '';
  setUserEmail = '';
  setUserPassword = '';
  usernameInput.textContent = "Username";
  usernameInput.className = 'neutral';
  swap(loginPage, createAccountPage);
})

var returnToLogin3 = document.getElementById('create-account-title');
returnToLogin3.addEventListener('click', function(e){
  swap(homePage, createAccountPage);
})

var createAccountButton1 = document.getElementById('create-account-button-1');
createAccountButton1.addEventListener('click', function(e){
  swap(createAccountPage, loginPage);
  var signInButton = document.getElementById('sign-in-button');
  var username = document.getElementById('sign-in-username');
  var password = document.getElementById('sign-in-password');
  username.value = '';
  password.value = '';
  signInButton.className = 'btn btn-primary';
  signInButton.textContent = 'SIGN IN';
})

var createAccountButton2 = document.getElementById('create-account-button-2');
createAccountButton2.addEventListener('click', function(e){
  swap(createAccountPage, loginPage);
  var signInButton = document.getElementById('sign-in-button');
  var username = document.getElementById('sign-in-username');
  var password = document.getElementById('sign-in-password');
  username.value = '';
  password.value = '';
  signInButton.className = 'btn btn-primary';
  signInButton.textContent = 'SIGN IN';
})

var createAccountButton = document.getElementById('create-account-button');
createAccountButton.addEventListener('click',function(e){
  var setUserName = document.getElementById('set-user-name').value;
  var setUserUsername = document.getElementById('set-user-username').value;
  var setUserEmail = document.getElementById('set-user-email').value;
  var setUserPassword = document.getElementById('set-user-password').value;
  var favorites = [];

  if(setUserUsername.length < 5){
    var userNameInput = document.getElementById('username-input');
    usernameInput.className += " invalid ";
    usernameInput.textContent = 'Username must be at least five characters';
  }
  if(setUserName.indexOf(' ')==-1){
    var userNameInput = document.getElementById('user-name-input');
    userNameInput.className += " invalid ";
    userNameInput.textContent = 'Include first and last name';
  }
  if(setUserEmail.indexOf('@')==-1){
    var userEmailInput = document.getElementById('user-email-input');
    userEmailInput.className += " invalid ";
    userEmailInput.textContent = 'Email address must be valid';
  }
  if(setUserPassword.length<5){
    var userPasswordInput = document.getElementById('user-password-input');
    userPasswordInput.className += " invalid ";
    userPasswordInput.textContent = 'Password must be at least five characters';
  }
  else{
    var data = {
      "name":setUserName, "username":setUserUsername, "email":setUserEmail, "password":setUserPassword, "id":new Date().getTime(), "favorites":favorites
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST','/createAccount/:username/');
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(JSON.stringify(data));


    xhr.addEventListener('load', function(e){
      var response = JSON.parse(xhr.responseText);
      var usernameInput = document.getElementById('username-input');
      if(response == true){
        usernameInput.textContent = "Username - that username is already in use";
        usernameInput.className = 'invalid';
      }
      else if(response == false){
        setUserName = '';
        setUserUsername = '';
        setUserEmail = '';
        setUserPassword = '';
        usernameInput.textContent = "Username";
        usernameInput.className = 'valid';
        login = document.getElementById('login');
        logout = document.getElementById('logout');
        swap(logout, login);

        login2 = document.getElementById('login-2');
        logout2 = document.getElementById('logout-2');
        swap(logout2, login2);

        greetUser = document.getElementById('greet-user');
        greetUser2 = document.getElementById('greet-user-2');
        greetUser3 = document.getElementById('greet-user-3');
        var str = data.name;
        var index = data.name.indexOf(" ");
        greetUser.textContent = "Welcome, "+str.slice(0,index);
        greetUser2.textContent = "Welcome, "+str.slice(0,index);
        greetUser3.textContent = "Welcome, "+str.slice(0,index);

        var viewFavorites = document.getElementById('view-favorites');
        viewFavorites.className = viewFavorites.className.replace(/hidden/g, " ");

        swap(homePage,createAccountPage);
      }
      else{
        usernameInput.textContent = "Username";
        usernameInput.className = 'neutral';
      }
    })
  }
})

var signInButton = document.getElementById('sign-in-button');
signInButton.addEventListener('click', function(e){
  var username = document.getElementById('sign-in-username');
  var password = document.getElementById('sign-in-password');
  var data = {
    "username":username.value, "password":password.value
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST','/login/:username/:password');
  xhr.setRequestHeader('Content-type','application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load',function(e){
    if(xhr.status == 401){
      signInButton.className = 'btn btn-danger';
      signInButton.textContent = 'INVALID USERNAME/PASSWORD';
    }
    else{
      username.value = '';
      password.value = '';
      signInButton.className = 'btn btn-primary';
      signInButton.textContent = 'SIGN IN';

      login = document.getElementById('login');
      logout = document.getElementById('logout');
      swap(logout, login);

      login2 = document.getElementById('login-2');
      logout2 = document.getElementById('logout-2');
      swap(logout2, login2);

      greetUser = document.getElementById('greet-user');
      greetUser2 = document.getElementById('greet-user-2');
      greetUser3 = document.getElementById('greet-user-3');
      var str = xhr.responseText;
      var index = str.indexOf(" ");
      currentUser = str.slice(0, index);

      greetUser.textContent = "Welcome, "+str.slice(0,index);
      greetUser2.textContent = "Welcome, "+str.slice(0,index);
      greetUser3.textContent = "Welcome, "+str.slice(0,index);
      swap(homePage, loginPage);

      var viewFavorites = document.getElementById('view-favorites');
      viewFavorites.className = viewFavorites.className.replace(/hidden/g, " ");

      var notification = document.getElementById('notification');
      var loginDiv = document.getElementById('login-div');
      loginDiv.removeChild(notification);
    }
  })
})
//Logout buttons
var logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', function(e){
  login = document.getElementById('login');
  logout = document.getElementById('logout');
  swap(login, logout);

  login2 = document.getElementById('login-2');
  logout2 = document.getElementById('logout-2');
  swap(login2, logout2);

  greetUser = document.getElementById('greet-user');
  greetUser2 = document.getElementById('greet-user-2');
  greetUser.textContent = '';
  greetUser2.textContent = '';
  swap(homePage, loginPage);

  var viewFavorites = document.getElementById('view-favorites');
  viewFavorites.className += ' hidden ';
})

var logoutButton2 = document.getElementById('logout-2');
logoutButton2.addEventListener('click', function(e){
  login = document.getElementById('login');
  logout = document.getElementById('logout');
  swap(login, logout);

  login2 = document.getElementById('login-2');
  logout2 = document.getElementById('logout-2');
  swap(login2, logout2);

  greetUser = document.getElementById('greet-user');
  greetUser2 = document.getElementById('greet-user-2');
  greetUser.textContent = '';
  greetUser2.textContent = '';
  swap(homePage, resultsPage);

  var viewFavorites = document.getElementById('view-favorites');
  viewFavorites.className += ' hidden ';
})

var logoutButton3 = document.getElementById('logout-3');
logoutButton3.addEventListener('click', function(e){
  login = document.getElementById('login');
  logout = document.getElementById('logout');
  swap(login, logout);

  login2 = document.getElementById('login-2');
  logout2 = document.getElementById('logout-2');
  swap(login2, logout2);

  greetUser = document.getElementById('greet-user');
  greetUser2 = document.getElementById('greet-user-2');
  greetUser.textContent = '';
  greetUser2.textContent = '';
  swap(homePage, favoritesPage);

  var viewFavorites = document.getElementById('view-favorites');
  viewFavorites.className += ' hidden ';
})

//Adding to favorites button
var addToFavorites = document.getElementById('add-to-favorites');
addToFavorites.addEventListener('click', function(e){
  var currentBreak = document.getElementById('stream-title').textContent;
  currentUser = document.getElementById('greet-user').textContent;
  var index = currentUser.indexOf(' ');
  currentUser = currentUser.slice(index+1);
  var data = {"currentUser":currentUser, "currentBreak":currentBreak};
  if(currentUser.length == 0){
    swap(loginPage, resultsPage);
    var notification = document.createElement('div');
    notification.setAttribute('class','alert alert-danger');
    notification.setAttribute('id','notification');
    notification.textContent = "You must be logged in to favorite breaks";
    loginDiv = document.getElementById('login-div');
    loginDiv.appendChild(notification);
  }
  else{
    var removeFromFavorites = document.getElementById('remove-from-favorites');
    var addToFavorites = document.getElementById('add-to-favorites');
    swap(removeFromFavorites, addToFavorites);
    var xhr = new XMLHttpRequest();
    xhr.open("POST",'/favorites/add/:location');
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(JSON.stringify(data));

    xhr.addEventListener('load', function(e){
    })
  }
})

//Removing from favorites
var removeFromFavorites = document.getElementById('remove-from-favorites');
var addToFavorites = document.getElementById('add-to-favorites');
removeFromFavorites.addEventListener('click', function(e){
  var currentBreak = document.getElementById('stream-title').textContent;
  currentUser = document.getElementById('greet-user').textContent;
  var index = currentUser.indexOf(' ');
  currentUser = currentUser.slice(index+1);
  var data = {"currentUser":currentUser, "currentBreak":currentBreak};
  swap(addToFavorites, removeFromFavorites);
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", '/favorites/remove/:location');
  xhr.setRequestHeader('Content-type','application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function(e){
  })
})

var viewFavorites = document.getElementById('view-favorites');
var favoritesContent = document.getElementById('favorites-content');
viewFavorites.addEventListener('click', function(){
  var data = {"currentUser":currentUser};
  swap(favoritesPage,homePage);
  clear(favoritesContent);
  var xhr = new XMLHttpRequest();
  xhr.open('POST','/favorites/view');
  xhr.setRequestHeader('Content-type','application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function(){
    var favoritesList = JSON.parse(xhr.responseText);
    console.log(favoritesList);
    favoritesList.forEach(function(favorite){
      var favoriteRow = document.createElement('div');
      favoriteRow.setAttribute('class','row');
      var camDiv = document.createElement('div');
      camDiv.setAttribute('class','col-lg-6 col-lg-offset-1');
      favoriteRow.appendChild(camDiv);
      var favoriteCam = document.createElement('iframe');
      favoriteCam.setAttribute('width','640');
      favoriteCam.setAttribute('height','360');
      favoriteCam.setAttribute('src', favorite.url);
      camDiv.appendChild(favoriteCam);
      var infoDiv = document.createElement('div');
      infoDiv.setAttribute('class','col-lg-4');
      var favoriteName = document.createElement('h1');
      favoriteName.setAttribute('align','center');
      favoriteName.style.color = 'white';
      favoriteName.textContent = favorite.name;
      var favoriteSize = document.createElement('h2');
      favoriteSize.setAttribute('align','center');
      var favoriteConditions = document.createElement('h3');
      favoriteConditions.setAttribute('align','center');

      favoriteSize.textContent = "Wave height: "+Math.floor(favorite.size_ft)+"-"+Math.ceil(favorite.size_ft) + " ft";
      if(favorite.size_ft<3){
        favoriteSize.style.backgroundColor = 'green';
        favoriteSize.style.color = 'white';
      }
      else if(favorite.size_ft>=3 && favorite.size_ft<6){
        favoriteSize.style.backgroundColor = 'orange';
        favoriteSize.style.color = 'white';
      }
      else{
        favoriteSize.style.backgroundColor = 'red';
        favoriteSize.style.color = 'white';
      }

      favoriteConditions.textContent = "Conditions: "+favorite.shape_full;
      if(favorite.shape_full == "Poor"){
        favoriteConditions.style.backgroundColor = 'red';
        favoriteConditions.style.color = 'white';
      }
      else if(favorite.shape_full == "Poor-Fair"){
        favoriteConditions.style.backgroundColor = 'orange';
        favoriteConditions.style.color = 'white';

      }
      else if(favorite.shape_full == "Fair"){
        favoriteConditions.style.backgroundColor = 'blue';
        favoriteConditions.style.color = 'white';
      }
      else{
        favoriteConditions.style.backgroundColor = 'green';
        favoriteConditions.style.color = 'white';
      }
      infoDiv.appendChild(favoriteName);
      infoDiv.appendChild(favoriteSize);
      infoDiv.appendChild(favoriteConditions);
      favoriteRow.appendChild(infoDiv);
      favoritesContent.appendChild(favoriteRow);
    })
  })
})
