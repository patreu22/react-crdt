var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var clients = [];
var clientRequestDict = {}
var tempState = {};
//Local IP
//192.168.178.20

app.use(express.static(__dirname + '/client/src/css'));
// parse application/json
app.use(bodyParser.json());


app.get('/', function (req, res) {
  	console.log('###GET REQUEST received');
  	//Add IP Address to the clients-array if not existing
  	var remIP = req.connection.remoteAddress
  	if (clients.indexOf(remIP) == -1){
      clients.push(remIP)
      console.log("Client "+remIP+" registered");
  	}else{
  		console.log("Client "+remIP+" already exists in Client Array");
      console.log("All Cients: "+ clients)
  	}

  	//Serve Index Site
  	res.sendFile(__dirname + '/client/public/index.html');
});




app.use(express.static(__dirname + '/client/public'));


//Handle Toggle-Change
app.post('/api', function (req, res){
	console.log('###API Post Request received###');
  sendToAllClients(req.body);
  lastObjState = req.body
  res.statusCode = 200;
  res.end();
});

//Register Client for LongPolling
app.get('/api/lp', function(req, res){
  //After the first sending the long polling is initialized
  clientRequestDict[req.connection.remoteAddress] = res;
});

app.get('/api/initial', function(req,res){
  res.end(JSON.stringify(tempState));
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


//Send new TimestampRegister to all Clients
function sendToAllClients(fileToSend){
    tempState = fileToSend
    clients.forEach(function(client){
        clientRequestDict[client].end(JSON.stringify(fileToSend));
    })
};


function registerClient(clientIP){
    clients.push(clientIP);
};
