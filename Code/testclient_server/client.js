var express = require('express');
var app = express();
var ip = require('ip');
var http = require('http');

var url = "http://10.200.1.63:3000/"

app.get('/', function (req, res) {
  res.send("Ready.\nSend me your commands through my API.");
});

app.get('/api/load', function (req, res) {
  var response = res
  http.get(url, (res) =>{
    let body = ""
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', function () {
      console.log(body);
      var doc = document.implementation.createHTML("example")
      doc.documentElement.innerHTML = body
      console.log("######Btn: "+doc)
      response.send("Got HTML file")
    });
  })

});





//Express method for opening the Server
var listener = app.listen(3000, function () {
  console.log("Client is wait on Port "+listener.address().port+" on the IP Address "+ip.address()+" for commands.");
  console.log(ip.address()+":"+listener.address().port);
});
