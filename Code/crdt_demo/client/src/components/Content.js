var React = require("react");
import "../css/Content.css"
import Toggle from "react-toggle"
var TimestampRegister = require('../TimestampRegister.js');
var CommunicationComponent = require('../CommunicationComponent.js');
var OpCounter = require('../OpCounter.js');

class Content extends React.Component {

  //Set initial localTimestampRegister
  constructor(props){
    super(props);
    this.state = {
      communicationComponent: new CommunicationComponent(),
      localTimestampRegister: new TimestampRegister("timestampDemo", false),
      localOpCounter: new OpCounter("counterDemo")
    };

    this.state.communicationComponent.addCRDT(this.state.localTimestampRegister)
    this.state.communicationComponent.addCRDT(this.state.localOpCounter)
    console.log("CommunicationComponent: "+ JSON.stringify(this.state.communicationComponent.crdtDict))
    console.log("TimestampRegister: "+this.state.localTimestampRegister.value)
    console.log("OpCounter: "+this.state.localOpCounter.value)
  };


  // //Setup long polling
  longPolling(){
    console.log("Long Polling started")
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/lp', true);
      xhr.setRequestHeader("Content-type", "text/plain");
      xhr.onreadystatechange = (function() {//Call a function when the state changes.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
         //Das hier muss allgemeiner sein!!!
         //this.state.communicationComponent.longPolling()
         var obj = JSON.parse(xhr.responseText)
         var crdt = this.state.communicationComponent.getCRDTwithName(obj.crdtName)
         //Get Object in state
         console.log("Obj: "+JSON.stringify(obj))
         console.log("Crdt: "+JSON.stringify(crdt))
         console.log("State: "+JSON.stringify(this.state))

        for (var key in this.state) {
          if(this.state[key].name === obj.crdtName){
            console.log("Key Polling Match: "+obj.crdtName)
            console.log("Key: "+this.state[key].name)
            console.log("Operation: "+obj.operation)
            var newObj = this.state[key].downstream(obj.operation)
            console.log("After downstream: "+ JSON.stringify(newObj))
            this.setState({key: newObj})
            console.log("Set new state!")
          }
        }

        this.longPolling();

      };
    }).bind(this);
      xhr.send();
      console.log("New long polling request sent");
  }

  //Send initial Request for long polling
  componentDidMount(){
    this.getInitialState()
    this.longPolling()
  };


  updateTimestampRegister(register){
    console.log("+++Register: "+JSON.stringify(register))
    console.log("State: "+JSON.stringify(this.state))
    this.setState({localTimestampRegister: this.state.localTimestampRegister.downstream(register)});
  };

  updateCRDT(crdt, downstreamAttributes, app){
    Object.keys(app.state).forEach(function(key, index){
      if(app.state[key].name === crdt.name){
        console.log("Name matched: "+app.state[key].name)
        console.log("Downstream Attributes: "+JSON.stringify(downstreamAttributes))
        app.setState({key: app.state[key].downstream(downstreamAttributes)})
      }
    });
  }

  setCRDT(crdt, app){
    Object.keys(app.state).forEach(function(key, index){
      if(app.state[key].name === crdt.name){
        app.setState({key: crdt})
      }
    });
  }

  counterChanged(increase){
    var operation = {"increase": increase}
    this.setState({localOpCounter: this.state.localOpCounter.downstream(operation)});
    this.state.communicationComponent.sendToServer(this.state.localOpCounter, "opCounter", operation);
  };

  toggleChanged(isChecked){
    //Update Local Register
    var tempReg = this.state.localTimestampRegister.downstream({value: isChecked, timestamp: new Date().getTime()});
    this.setState({localTimestampRegister: tempReg});
    this.state.communicationComponent.sendToServer(this.state.localTimestampRegister, "timestampRegister");
  };


  getInitialState(){
    this.state.communicationComponent.getInitialStateFromServer('/api/initial', this, function(initialCRDT, app){
        //app.updateCRDT(initialCRDT, initialCRDT, app);
        console.log("Initial CRDT: "+JSON.stringify(initialCRDT))
        app.setCRDT(initialCRDT, app)
    });
  };




  //checked={this.state.localTimestampRegister.value}
  //What is shown in the browser
  render() {
  	return(
  		<div className="Content">
  			<label>
  				<br/>
  				<Toggle
    				icons={false}
            checked = {this.state.localTimestampRegister.value}
    				onChange={
              (myToggle) => this.toggleChanged(myToggle.target.checked)} />
			  </label>
        <div>
          <label>{this.state.localOpCounter.value}</label>
          <button onClick={() => this.counterChanged(true)}>Increment</button>
          <button onClick={() => this.counterChanged(false)}>Decrement</button>
        </div>
      </div>
  	);
  };

};





export default Content;
