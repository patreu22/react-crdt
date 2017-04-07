module.exports = function CommunicationComponent(){
this.crdtDict = {};


this.addCRDT = (function(crdt){
  this.crdtDict[crdt.name] = crdt
}).bind(this);

this.sendToLocal = function(crdt){
  var local = this.crdtDict[crdt.name]
  local.downstream(crdt)
};

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
  console.log("CRDT: "+JSON.stringify(crdt))
  console.log("CRDT Type: "+ crdtType)
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
        "operation": operation
      }
      break
    default:
      console.log("Default branch")
      msg = {}
  }

  console.log("Message to send: "+JSON.stringify(msg))
  xhr.send(JSON.stringify(msg));



};

//'/api/initial'
this.getInitialStateFromServer = function(path, app, completionHandler){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path , true);
  xhr.setRequestHeader("Content-type", "text/plain");
  xhr.onreadystatechange = (function() {
    //Call the function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
     console.log('Initial Response:');
     console.log(xhr.responseText);
     if (!(xhr.responseText == "{}")){
       var response = JSON.parse(xhr.responseText)
       console.log("Initital Response data:")
       console.log(JSON.stringify(response))
       console.log("CRDT Dict: "+ JSON.stringify(this.crdtDict))
       var that = this
       Object.keys(this.crdtDict).forEach(function(key, index){
         console.log("Current Key: "+ key)
         if (key in response){
           console.log("Key matched: "+key)
           var data = response[key]
           console.log("Data: "+ JSON.stringify(data))
           switch (data.crdtType){
             case "timestampRegister":
              completionHandler(that.crdtDict[key].setRegister(data.value, data.timestamp), app);
              console.log("timestampRegister detected")
              break
            case "opCounter":
              completionHandler(that.crdtDict[key].setValue(data.value), app)
              console.log("opCounter")
              break
            default:
              console.log("Default")
              break
            }
         }
      });

      //  //AUF REGISTER ZUGESCHNITTEN!!!
      //  var ts = response.timestampDemo
      //  console.log(JSON.stringify(response))
       //
      //  console.log("Initial Value Set")
    }else{
       console.log("Response was empty");
    }
  }
}).bind(this);
  xhr.send();
}


this.getAllComponents = function(){
  var retArray = []
  for (var key in crdtDict){
      value = crdtDict[key]
      retArray.append(value)
  }
  return retArray
}

this.crdtIsInDictWithName = function(name){
  Object.keys(this.crdtDict).forEach(function(key, value){
    if(key === name){
      return true
    }
  })
  return false
}

this.getCRDTwithName = function(name){
  return this.crdtDict[name]
}


//Setup long polling
this.longPolling = function(app){
  console.log("Long polling started")
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/lp', true);
  xhr.setRequestHeader("Content-type", "text/plain");
  xhr.onreadystatechange = (function() {//Call a function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      console.log('Response Text:');
      console.log(xhr.responseText);
      var obj = JSON.parse(xhr.responseText)
      var crdt = this.getCRDTwithName(obj.crdtName)
      //Get Object in state
      console.log("Obj: "+JSON.stringify(obj))
      console.log("Crdt: "+JSON.stringify(crdt))
      console.log("State: "+JSON.stringify(this.state))

      var i = 0
      for (var key in app.state) {
        console.log("i: "+i)
        console.log("i-ter Key: "+key)
        i += 1
        if(app.state[key].name === obj.crdtName){
          console.log("Key Polling Match: "+obj.crdtName)
          console.log("Key: "+app.state[key].name)
          console.log("Operation: "+JSON.stringify(obj.operation))

          var newObj = app.state[key].downstream(obj.operation)
          console.log("After downstream: "+ JSON.stringify(newObj))
          app.setState({[key] : newObj})
          console.log("Set new state!")
        }
      }
      this.longPolling(app);
    }
  }).bind(this);
  xhr.send();
  console.log("New long polling request sent by CommunicationComponent");
};

};





// // //Setup long polling
// longPolling(){
//   console.log("Long Polling started")
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', '/api/lp', true);
//     xhr.setRequestHeader("Content-type", "text/plain");
//     xhr.onreadystatechange = (function() {//Call a function when the state changes.
//     if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
//        //Das hier muss allgemeiner sein!!!
//        //this.state.communicationComponent.longPolling()
//        var obj = JSON.parse(xhr.responseText)
//        console.log("State before: "+ JSON.stringify(this.state))
//        var crdt = this.state.communicationComponent.getCRDTwithName(obj.crdtName)
//        //Get Object in state
//        console.log("Obj: "+JSON.stringify(obj))
//        console.log("Crdt: "+JSON.stringify(crdt))
//        console.log("State: "+JSON.stringify(this.state))
//
//       var i = 0
//       for (var key in this.state) {
//         console.log("i: "+i)
//         console.log("i-ter Key: "+key)
//         i += 1
//         if(this.state[key].name === obj.crdtName){
//           console.log("Key Polling Match: "+obj.crdtName)
//           console.log("Key: "+this.state[key].name)
//           console.log("Operation: "+JSON.stringify(obj.operation))
//
//           var newObj = this.state[key].downstream(obj.operation)
//           console.log("After downstream: "+ JSON.stringify(newObj))
//           this.setState({[key] : newObj})
//           console.log("Set new state!")
//         }
//       }
//
//       this.longPolling();
//
//     };
//   }).bind(this);
//     xhr.send();
//     console.log("New long polling request sent");
// }
