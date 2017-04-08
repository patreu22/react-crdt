var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ip = require('ip');
var TimestampRegister = require("./client/src/TimestampRegister.js")
var OpCounter = require("./client/src/OpCounter.js")
var CircularJSON = require("circular-json")



var clients = [];
var clientRequestDict = {}
var tempState = {};
var pollingQueue = {}
var blockFlagDict = {}
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

//Just for debugging
var totalRequests = 0
//Handle new request
app.post('/api', function (req, res){
	console.log('###API Post Request received###');
  totalRequests += 1
  console.log("##########")
  console.log("#Total: " +  totalRequests+"#")
  console.log("##########")
  sendToAllClientsExcept(req.connection.remoteAddress, req.body);
  res.statusCode = 200;
  res.end();
});

//for debugging
var lpCounter = 0
var sendingAttemts = 0

//Register Client for LongPolling
app.get('/api/lp', function(req, res){
  lpCounter += 1
  var client = req.connection.remoteAddress
  //After the first sending the long polling is initialized
  clientRequestDict[client] = {}
  clientRequestDict[client]["res"] = res;
  clientRequestDict[client]["used"] = false
  //Check if key already exists
  if (!pollingQueue.hasOwnProperty(client)){
    //Branch on first long polling Request
    console.log("#Polling: No pollingQueue yet. Launched one.")
    pollingQueue[client] = []
  }else{
    //Check if something was not send yet
    console.log("#Polling: Queue exists.")
    console.log("#Polling: Current Queue length: "+pollingQueue[client].length)
    //for debugging

    if (pollingQueue[client].length > 0){
      if(clientRequestDict[client]["used"]){
          console.log("####USED!!!!")
      }else{
          res.end(JSON.stringify(pollingQueue[client].shift()))
          clientRequestDict[client]["res"] = {}
          clientRequestDict[client]["used"] = true
      }

      console.log("#Polling: Sent pending file.")
      console.log("#Polling: there was a pending file to send. Sent.")
    }
  }
});

app.get('/api/initial', function(req,res){
  console.log("Initial to send: "+ JSON.stringify(tempState))
  res.end(JSON.stringify(tempState));
});


var listener = app.listen(3000, function () {
  console.log("Server is listening on Port "+listener.address().port+"on the IP Address "+ip.address())
  console.log(ip.address()+":"+listener.address().port);
});

//for debugging
var errorCntr = 0
var successCntr = 0
//Send new TimestampRegister to all Clients
function sendToAllClientsExcept(sender, fileToSend){
    console.log("File to send: "+ JSON.stringify(fileToSend))
    //Client-Features for the server
    if (fileToSend.crdtName in tempState){
      var tempFile = tempState[fileToSend.crdtName]
    }else{
      switch (fileToSend.crdtType){
        case "timestampRegister":
         var tempFile = new TimestampRegister(fileToSend.crdtName, false, fileToSend.operation.timestamp - 1)
         console.log("timestampRegister")
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
    }
    tempState[fileToSend.crdtName] = tempFile.downstream(fileToSend.operation)

    //Send to all
    if (Object.keys(clientRequestDict).length === 0){
      console.log("No Clients registered.")
    }else{
      clients.forEach(function(client){
          if (sender !== client){
            pollingQueue[client].push(fileToSend)
            console.log("#Polling: Queue length STACE: "+pollingQueue[client].length)
            if (Object.keys(clientRequestDict[client]["res"]).length === 0){
                console.log("!Error: Can't use Long Polling right now")
                errorCntr +=1
            }else{
              console.log("Success: Use long polling right now")
              successCntr += 1

              if(clientRequestDict[client]["used"]){
                  console.log("####USED!!!!")
              }else{
                clientRequestDict[client]["res"].end(JSON.stringify(pollingQueue[client].shift()));
                sendingAttemts += 1
                console.log("Sending Attemts: "+sendingAttemts)
                clientRequestDict[client]["res"] = {}
                clientRequestDict[client]["used"] = true
              }
            }
          }else{
            console.log("Sender and Client is both "+sender)
          }
      });
    }
    console.log("Error Count: "+errorCntr)
    console.log("Success Count: "+successCntr)
};

function registerClient(clientIP){
    clients.push(clientIP);
};
