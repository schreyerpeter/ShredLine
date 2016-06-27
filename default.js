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

searchButton.addEventListener('click', function(e){
  var xhr = new XMLHttpRequest();
  xhr.open('GET','/streams');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(search.value);
  console.log('Durr');

  xhr.addEventListener("load",function(){
    console.log("Hey");
  })
});
