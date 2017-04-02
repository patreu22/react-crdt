export function CommunicationComponent(){
this.crdtDict = {};


this.addCRDT = (function(crdt){
  this.crdtDict[crdt.name] = crdt
}).bind(this);

this.sendToLocal = function(crdt){
  var local = this.crdtDict[crdt.name]
  local.downstream(crdt)
};

this.sendToServer = function(crdt, crdtType, increase){
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
  console.log("Increase: "+ increase)
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
        operation: {
          increase: increase
        }
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
       console.log("CRDT Dict: "+ JSON.stringify(this.crdtDict))
       console.log(JSON.stringify(response))
       var that = this
       Object.keys(this.crdtDict).forEach(function(key, index){
         console.log("Current Key: "+ key)
         if (key in response){
           console.log("Key matched: "+key)
           var data = response[key]
           console.log("Data: "+ JSON.stringify(data))
           switch (data.crdtType){
             case "timestampRegister":
              completionHandler(that.crdtDict[key].downstream({value: data.operation.value, timestamp: data.operation.timestamp}), app);
              console.log("timestampRegister detected")
              break
            case "opCounter":
              completionHandler(that.crdtDict[key].downstream(data.operation.increase), app)
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

this.longPolling = function(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/lp', true);
  xhr.setRequestHeader("Content-type", "text/plain");
  xhr.onreadystatechange = (function() {//Call a function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      console.log('Response Text:');
      console.log(xhr.responseText);

      //...Baustelle
    }
  })
};

};
