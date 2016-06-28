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

  xhr.addEventListener("load",function(){
    var response = JSON.parse(xhr.responseText);

    response.forEach(function(location){
      if(location.id.toLowerCase().indexOf(search.value.toLowerCase())!==-1){
        var stream = document.getElementById('stream');
        var frame = document.getElementById('frame');
        console.log(location.url);
        frame.setAttribute('src',location.url);
      }
    })
  })
});
