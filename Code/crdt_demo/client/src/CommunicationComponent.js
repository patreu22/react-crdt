module.exports = function CommunicationComponent(){
this.crdtDict = {};


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
    }else{
       console.log("Response was empty");
    }
  }
}).bind(this);
  xhr.send();
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
      var crdt = this.crdtDict[obj.crdtName]

      for (var key in app.state) {
        if(app.state[key].name === obj.crdtName && key !== "key"){
          var newObj = app.state[key].downstream(obj.operation)
          app.setState({[key] : newObj})
        }
      }
      this.longPolling(app);
    }
  }).bind(this);
  xhr.send();
  console.log("New long polling request sent by CommunicationComponent");
};

};
