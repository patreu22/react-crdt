export function CommunicationComponent(){
this.crdtDict = {};


this.addCRDT = (function(crdt){
  this.crdtDict[crdt.name] = crdt
}).bind(this);

this.sendToLocal = function(crdt){
  var local = this.crdtDict[crdt.name]
  local.downstream(crdt)
};

this.sendToRemote = function(crdt){

  //Send changed Object to Server
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api', true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = (function() {//Call a function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
       console.log("###Counter changed POST request sent###");
       console.log("Counter Status is now: "+ this.crdt.value);
    };
  }).bind(this);
  xhr.send(JSON.stringify(this.crdt));
};

//'/api/initial'
this.getInitialStateFromServer = function(crdt, path){
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
       crdt.downstream(response);
       console.log("Initial Value Set")
     }else{
       console.log("Response was empty");
     }
  };
}).bind(this);
  xhr.send();
}


this.getAllComponents(){
  var retArray = []
  for (var key in crdtDict){
      value = crdtDict[key]
      retArray.append(value)
  }
  return retArray
}




};
