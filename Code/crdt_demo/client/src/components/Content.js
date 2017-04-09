var React = require("react");
import "../css/Content.css"
import Toggle from "react-toggle"
var TimestampRegister = require('../TimestampRegister.js');
var CommunicationComponent = require('../CommunicationComponent.js');
var OpCounter = require('../OpCounter.js');
var OpORSet = require("../OpORSet.js")


class Content extends React.Component {
  //Set initial localTimestampRegister
  constructor(props){
    super(props);
    this.state = {
      communicationComponent: new CommunicationComponent(this),
      localTimestampRegister: new TimestampRegister("timestampDemo", false),
      localOpCounter: new OpCounter("counterDemo"),
      localOpORSet: new OpORSet("orSetDemo")
    };
    console.log("Initial OpORSet: "+ JSON.stringify(this.state.localOpORSet))
    this.state.communicationComponent.addCRDT(this.state.localTimestampRegister)
    this.state.communicationComponent.addCRDT(this.state.localOpCounter)
    this.state.communicationComponent.addCRDT(this.state.localOpORSet)
    this.state.communicationComponent.getInitialStateFromServer()
    this.state.communicationComponent.longPolling()
  };

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

  addElementToOrSet(){
    var operation = { element: { element: "Hello", uniqueID: Math.floor(Math.random() * 1000000000)} , "add": true}
    console.log("Local" +JSON.stringify(this.state.localOpORSet))
    this.setState({localOpORSet: this.state.localOpORSet.downstream(operation)});
    this.state.communicationComponent.sendToServer(this.state.localOpORSet, "opORSet", operation);
  }

  removeElementFromORSet(orSet, elem){
    console.log(this)
    console.log("orSet: "+JSON.stringify(orSet))
    console.log("Element to remove: "+JSON.stringify(elem))
    var operation = { element: elem, "add": false}
    console.log("Local" +JSON.stringify(this.state.localOpORSet))
    this.setState({localOpORSet: this.state.localOpORSet.downstream(operation)});
    console.log("LocalOpORSet after Downstream: "+JSON.stringify(this.state.localOpORSet))
    this.state.communicationComponent.sendToServer(this.state.localOpORSet, "opORSet", operation);
  }

  //What is shown in the browser
  //<ol>{elementsToPresent}</ol>
  render() {
    console.log("Blub:"+this.state.localOpCounter.value)
    var elementsToPresent = [];
    var orSet = this.state.localOpORSet
    var elements = orSet.valueSet
    for(var i = 0; i < elements.length; i++){
      var elementToRemove = elements[i]
      elementsToPresent.push(<li key={elements[i].uniqueID}>{
          elements[i].element}
          <button onClick={() => this.removeElementFromORSet(orSet, elementToRemove)}>Remove</button>
        </li>);
    }
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
        <div>
          <ol>{elementsToPresent}</ol>
          <button onClick={() => this.addElementToOrSet()}>Add</button>
        </div>
      </div>
  	);
  };

};

export default Content;
