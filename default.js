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
    console.log("response");
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
