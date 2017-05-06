//The communication Entity!
module.exports.CommunicationComponent = function(app){
this.crdtDict = {};
this.pendingMessagesQueue = []
this.correspondingApp = app



window.addEventListener("online", onlineAgain.bind(this))

this.setupApiRoutes = function(toServer, initial, longPolling){
  this.sendToServerURL = toServer
  this.initialStartURL = initial
  this.longPollingURL = longPolling
}

function onlineAgain(){
    this.pendingMessagesQueue.forEach(function(message, mIndex){
      console.log("Message Sending after re-online: "+message)
      this.manageSending(msgWrapper(message))
    }, this)
    if (this.correspondingApp !== undefined){
      this.getInitialStateFromServer()
    }
}

this.addCRDT = (function(crdt){
  this.crdtDict[crdt.name] = crdt
}).bind(this);

this.start = function(){
  this.getInitialStateFromServer()
  this.longPolling()
}


this.sendToServer = function(crdt, operation){
  //Send changed Object to Server
  var xhr = new XMLHttpRequest();
  xhr.open('POST', this.sendToServerURL, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = (function() {//Call a function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
       console.log("---POST Request successful.---")
       console.log("Response: "+xhr.responseText)
    };
  })
  console.log("OPERATION: "+JSON.stringify(operation))
  var msg = {
        crdtName: crdt.name,
        crdtType: crdt.type,
        operation : operation
  }

  this.manageSending(function(){xhr.send(JSON.stringify(msg))})
};

//'/api/initial'
this.getInitialStateFromServer = function(){
  this.pendingMessagesQueue = []
  var xhr = new XMLHttpRequest();
  this.correspondingApp  = app
  xhr.open('GET', '/api/initial' , true);
  xhr.setRequestHeader("Content-type", "text/plain");
  xhr.onreadystatechange = (function() {
    //Call the function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
     console.log('Initial Response');
     console.log(xhr.responseText);
     if (!(xhr.responseText == "{}")){
       var response = JSON.parse(xhr.responseText)
       Object.keys(this.crdtDict).forEach(function(key, index){
         if (key in response){
           console.log("Data: "+ JSON.stringify(response[key]))
           var data = response[key]
           switch (data.crdtType){
             case "lwwRegister":
              this.setCRDT(this.crdtDict[key].setRegister(data.value, data.timestamp))
              console.log("lwwRegister detected")
              break
            case "opCounter":
              this.setCRDT(this.crdtDict[key].setValue(data.value))
              console.log("opCounter recognized")
              break
            case "opORSet":
              console.log("All data: "+JSON.stringify(data))
              this.setCRDT(this.crdtDict[key].setValue(data.valueSet))
              console.log("opORSet")
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
  }
}).bind(this);
  this.manageSending(function(){xhr.send()})
  //this.longPolling()
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
    toSend()
  }else{
    this.pendingMessagesQueue.push(msgWrapper(toSend))
  }
 }

function msgWrapper(msg){
    return msg
}


this.setCRDT = function(crdt){
  console.log("CRDT Object: "+JSON.stringify(crdt))
  Object.keys(this.correspondingApp.state).forEach(function(key, index){
      console.log("#Set")
    if(this.correspondingApp.state[key].name === crdt.name){
      this.correspondingApp.setState({key: crdt})
    }
  }, this);
}

}

//Operation-Based ORSet!
module.exports.OpORSet = function(name){

this.valueSet = []
this.name = name
this.type = "opORSet"

this.setValue = function(setValue){
  console.log("Set value: "+setValue)
  this.valueSet = setValue
  return this
}

this.lookup = function(e){
  console.log("Element to lookup: "+JSON.stringify(e))
  var foundIt = false
  this.valueSet.forEach(function(element){
    if(JSON.stringify(element) === JSON.stringify(e)){
      foundIt = true
    }
  })
  if (foundIt){
    return true
  }else{
    return false
  }
}


this.setUniqueId = function(e){
  var elem = {
      "element" : e,
      "uniqueID" : Math.floor(Math.random() * 1000000000)
  }
  return elem
}

this.add = function(e){
    console.log("###e: "+JSON.stringify(e))
    if (typeof e === 'object'){
      console.log("Hey, it's an object")
      if(e.uniqueID === undefined){
        console.log("No unique ID. Setting one for object.")
        this.valueSet.push(this.setUniqueId(e))
      }else{
        console.log("Unique ID found. Push to Set.")
        this.valueSet.push(e)
      }
    }else{
      console.log("Simple data structure. Append Unique ID.")
      this.valueSet.push(this.setUniqueId(e))
    }
}

this.remove = function(e){
  var idsToRemove = e
  var finished = false
  var i = 0
  console.log("Value Set: "+this.valueSet)
  while(!finished){
      if(i<this.valueSet.length){
        for(var j=0;j<idsToRemove.length;j++){
          console.log("Value Set: "+JSON.stringify(this.valueSet[i]))
          console.log("Id to remove: "+ idsToRemove[j])
          if(this.valueSet[i].uniqueID === idsToRemove[j]){
            console.log("Got one!")
            this.valueSet.splice(i,1)
              i = 0
          }
        }
        i++
      }else{
        finished = true
      }
    }
  }

this.getIDsToRemove = function(e){
  var setToRemove = []
  if(this.lookup(e)){
    for(var i=0;i<this.valueSet.length;i++){
      if(e.element === this.valueSet[i].element){
        setToRemove.push(this.valueSet[i].uniqueID)
      }
    }
  }
  return setToRemove
}


this.setToDisplay = function(){
    console.log("Return set to display!")
    var retSet = []
    var itemsProcessed = 0

    for(var i=0;i<this.valueSet.length;i++){
      var value = this.valueSet[i]
      var alreadyInSet = false
      for(var j=0;j<retSet.length;j++){
        var valueToCompare = retSet[j]
        if (value.element === valueToCompare.element){
          alreadyInSet = true
        }
      }
      if(!alreadyInSet){
        retSet.push(value)
      }
    }
    console.log("RetSet: "+ retSet)
    return retSet
  }

this.downstream = function(operation){
  console.log("Operation: "+JSON.stringify(operation))
  if(operation.add){
    this.add(operation.element)
  }else{
    this.remove(operation.element)
  }
  console.log("After downstream: "+JSON.stringify(this))
  return this
}

}


//The Last-Writer-Wins-Register!
module.exports.OpLwwRegister =  function(name, defaultValue = false, date = new Date().getTime()){
	this.name = name
	this.value = defaultValue
	this.timestamp = date;
  this.type = "lwwRegister"

	this.setRegister = (function(val, stamp){
		this.value = val;
		this.timestamp = stamp;
		return this
	});

	this.getName = function(){
		return this.name;
	}

	this.getValue = (function(){
		return this.value;
	});

	this.getTimeStamp = (function(){
		return this.timestamp;
	});

	this.downstream = (function(operation){
		if (operation.timestamp > this.timestamp){
			this.setRegister(operation.value, operation.timestamp);
			console.log("Current value switched to "+this.value);
		}else{
			console.log(this.timestamp + " is a newer timestamp than " + operation.timestamp + ". Value won't change.");
		};
		return this;
	}).bind(this);
};



//The OpCounter
module.exports.OpCounter =  function(name, value=0){
	this.name = name
	this.value = value;
  this.type = "opCounter"

	this.setValue = (function(val){
		console.log("Value to set: "+val)
		this.value = val
		return this
	}).bind(this);

	this.increment = (function(){
		this.value += 1;
		console.log("Incremented");
		console.log(this.value)
		return this
	}).bind(this);

	this.decrement = (function(){
		this.value -= 1;
		console.log("Decremented");
		console.log(this.value)
		return this
	}).bind(this);

	this.getValue = (function(){
		return this.value;
	});

	this.getName = function(){
		return this.name;
	}

	this.downstream = (function(operation){
		if(operation.increase){
			this.increment();
		}else{
			this.decrement();
		}
		return this;
	}).bind(this);

};

module.exports.printMsg = function() {
  console.log("This is a message from the demo package");
}
