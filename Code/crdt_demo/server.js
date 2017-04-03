var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ip = require('ip');
var TimestampRegister = require("./client/src/TimestampRegister.js")
var OpCounter = require("./client/src/OpCounter.js")



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


//Handle new request
app.post('/api', function (req, res){
	console.log('###API Post Request received###');
  sendToAllClientsExcept(req.connection.remoteAddress, req.body);
  res.statusCode = 200;
  res.end();
});

//Register Client for LongPolling
app.get('/api/lp', function(req, res){
  //After the first sending the long polling is initialized
  clientRequestDict[req.connection.remoteAddress] = res;
});

app.get('/api/initial', function(req,res){
  console.log("Initial to send: "+ JSON.stringify(tempState))
  res.end(JSON.stringify(tempState));
});


var listener = app.listen(3000, function () {
  console.log("Server is listening on Port "+listener.address().port+"on the IP Address "+ip.address())
  console.log(ip.address()+":"+listener.address().port);
});


//Send new TimestampRegister to all Clients
function sendToAllClientsExcept(sender, fileToSend){
    console.log("File to send: "+ JSON.stringify(fileToSend))
    //Client-Features for the server
    if (fileToSend.crdtName in tempState){
      console.log("Hey")
      var tempFile = tempState[fileToSend.crdtName]
    }else{
      console.log("Ho")
      switch (fileToSend.crdtType){
        case "timestampRegister":
         var tempFile = new TimestampRegister(fileToSend.crdtName, false, fileToSend.operation.timestamp - 1)
         console.log("timestampRegister detected")
         break
       case "opCounter":
         var tempFile = new OpCounter(fileToSend.crdtName)
         console.log("opCounter")
         break
       default:
         console.log("Default")
         break
       }
      tempFile.crdtType = fileToSend.crdtType
      console.log(JSON.stringify(fileToSend))
      console.log(JSON.stringify(tempFile))
    }
    tempState[fileToSend.crdtName] = tempFile.downstream(fileToSend.operation)

    if (Object.keys(clientRequestDict).length === 0){
      console.log("No Clients registered.")
    }else{
      clients.forEach(function(client){
          if (sender !== client){
            console.log("###Data to send###")
            console.log(JSON.stringify(fileToSend))
            clientRequestDict[client].end(JSON.stringify(fileToSend));
          }else{
            console.log("Sender and Client is both "+sender)
          }
      });
    }
};

function registerClient(clientIP){
    clients.push(clientIP);
};
