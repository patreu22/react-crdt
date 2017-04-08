module.exports = function CommunicationComponent(app){
this.crdtDict = {};
this.pendingMessagesQueue = []
this.correspondingApp = app

var CircularJSON = require("circular-json")

window.addEventListener("online", onlineAgain.bind(this))
function onlineAgain(){
    this.pendingMessagesQueue.forEach(function(message, mIndex){
      this.manageSending(wrapper(message))
    }, this)
    this.pendingMessagesQueue = []
    if (this.correspondingApp !== undefined){
      this.getInitialStateFromServer()
    }
}

this.addCRDT = (function(crdt){
  this.crdtDict[crdt.name] = crdt
}).bind(this);


this.sendToServer = function(crdt, crdtType, operation){
  //Send changed Object to Server
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api', true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = (function() {//Call a function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
       console.log("---POST Request successful.---")
       console.log("Response: "+xhr.responseText)
    };
  })
  var msg = {}
  switch (crdtType){
    case "timestampRegister":
      msg = {
        crdtName: crdt.name,
        crdtType: crdtType,
        operation: {
          value: crdt.value,
          timestamp: crdt.timestamp
        }
      }
      break
    case "opCounter":
      msg = {
        crdtName: crdt.name,
        crdtType: crdtType,
        "operation": operation,
      }
      break
    default:
      console.log("Default branch")
      msg = {}
  }
  this.manageSending(function(){xhr.send(JSON.stringify(msg))})
};

//'/api/initial'
this.getInitialStateFromServer = function(){
  var xhr = new XMLHttpRequest();
  this.correspondingApp  = app
  xhr.open('GET', '/api/initial' , true);
  xhr.setRequestHeader("Content-type", "text/plain");
  xhr.onreadystatechange = (function() {
    //Call the function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
     console.log('Initial Response:');
     console.log(xhr.responseText);
     if (!(xhr.responseText == "{}")){
       var response = JSON.parse(xhr.responseText)
       Object.keys(this.crdtDict).forEach(function(key, index){
         if (key in response){
           var data = response[key]
           switch (data.crdtType){
             case "timestampRegister":
              this.setCRDT(this.crdtDict[key].setRegister(data.value, data.timestamp))
              console.log("timestampRegister detected")
              break
            case "opCounter":
              this.setCRDT(this.crdtDict[key].setValue(data.value))
              console.log("opCounter")
              break
            default:
              console.log("Default")
              break
            }
         }
      }, this)
    }else{
       console.log("Response was empty");
    }
    this.longPolling()
  }
}).bind(this);
  this.manageSending(function(){xhr.send()})
}


//Setup long polling
this.longPolling = function(){
  console.log("Long polling started")
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/lp', true);
  xhr.setRequestHeader("Content-type", "text/plain");
  xhr.onreadystatechange = (function() {//Call a function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      var obj = JSON.parse(xhr.responseText)
      var crdt = this.crdtDict[obj.crdtName]

      for (var key in this.correspondingApp.state) {
        if(app.state[key].name === obj.crdtName && key !== "key"){
          var newObj = this.correspondingApp.state[key].downstream(obj.operation)
          this.correspondingApp.setState({[key] : newObj})
        }
      }
      this.longPolling();
    }
  }).bind(this);
  this.manageSending(function(){xhr.send()})
};

//For testing purposes
this.manageSending = function(toSend){
  console.log(toSend)
  if (window.navigator.onLine){
    console.log("Browser is online!")
    toSend()
  }else{
    this.pendingMessagesQueue.push(wrapper(toSend))
  }
 }

function wrapper(msg){
    console.log("Message: "+msg)
    return msg
}


this.setCRDT = function(crdt){
  Object.keys(this.correspondingApp.state).forEach(function(key, index){
    if(this.correspondingApp.state[key].name === crdt.name){
      this.correspondingApp.setState({key: crdt})
    }
  }, this);
}

}
