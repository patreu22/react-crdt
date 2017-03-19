export function CommunicationComponent(){
this.crdtDict = {};


this.addCRDT = (function(crdt){
  this.crdtDict[crdt.name] = crdt
}).bind(this);

this.sendToLocal = function(crdt){
  var local = this.crdtDict[crdt.name]
  local.downstream(crdt)
};

this.sendToServer = function(crdt){
  //Send changed Object to Server
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api', true);
  console.log("Prepare Request. Data:")
  console.log(crdt)
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = (function() {//Call a function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
       console.log("###Counter changed POST request sent###");
       console.log("Counter Status is now: "+ crdt.value);
    };
  })
  xhr.send(JSON.stringify(crdt));
};

//'/api/initial'
this.getInitialStateFromServer = function(crdt, path, app, completionHandler){
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
       console.log(response)
       completionHandler(crdt.setRegister(response.value, response.timestamp), app);
       console.log("Initial Value Set")
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




};