var React = require("react");
import "../css/Content.css"
import Toggle from "react-toggle"
var crdt = require("react-crdt")
// var TimestampRegister = require('../TimestampRegister.js');
// var CommunicationComponent = require('../CommunicationComponent.js');
// var OpCounter = require('../OpCounter.js');
// var OpORSet = require("../OpORSet.js")


class Content extends React.Component {
  //Set initial localTimestampRegister
  constructor(props){
    super(props);
    this.state = {
      communicationComponent: new crdt.CommunicationComponent(this),
      localTimestampRegister: new crdt.TimestampRegister("timestampDemo", false),
      localOpCounter: new crdt.OpCounter("counterDemo"),
      localOpORSet: new crdt.OpORSet("orSetDemo"),
      orInput: ''
    };
    this.state.communicationComponent.addCRDT(this.state.localTimestampRegister)
    this.state.communicationComponent.addCRDT(this.state.localOpCounter)
    this.state.communicationComponent.addCRDT(this.state.localOpORSet)
    this.state.communicationComponent.start()
  };

  counterChanged(increase){
    var operation = {"increase": increase}
    this.setState({localOpCounter: this.state.localOpCounter.downstream(operation)});
    this.state.communicationComponent.sendToServer(this.state.localOpCounter, "opCounter", operation);
  };

  toggleChanged(isChecked){
    var operation = {value: isChecked, timestamp: new Date().getTime()}
    this.setState({localTimestampRegister: this.state.localTimestampRegister.downstream(operation)});
    this.state.communicationComponent.sendToServer(this.state.localTimestampRegister, "timestampRegister");
  };

  addElementToOrSet = () =>{
    var input = this.state.orInput
    if(input){
      var operation = { element: { element: input, uniqueID: Math.floor(Math.random() * 1000000000)} , "add": true}
      this.setState({localOpORSet: this.state.localOpORSet.downstream(operation)});
      this.state.communicationComponent.sendToServer(this.state.localOpORSet, "opORSet", operation);
      this.setState({orInput: ""})
    }else{
      console.log("Please enter a value")
    }
  }

  removeElementFromORSet(orSet, elem){
    var operation = { element: elem, "add": false}
    this.setState({localOpORSet: this.state.localOpORSet.downstream(operation)});
    this.state.communicationComponent.sendToServer(this.state.localOpORSet, "opORSet", operation);
  }

  handleInput = (event) => {
    this.setState({orInput: event.target.value}, function(){
    })
  }

  render() {
    var elementsToPresent = [];
    //var elements = this.state.localOpORSet.valueSet
    var elements = this.state.localOpORSet.setToDisplay()
    console.log("Elements: "+elements)
    for(var i = 0; i < elements.length; i++){
      var elementToRemove = elements[i]
      elementsToPresent.push(<li key={elements[i].uniqueID}>{
          elements[i].element}
          <button onClick={() => this.removeElementFromORSet(this.state.localOpORSet, elementToRemove)}>Remove</button>
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
          <ul>{elementsToPresent}</ul>
          <input type="text" value={this.state.orInput} onChange={this.handleInput} placeholder="Add a Text to append it to ORSet"/>
          <button onClick={this.addElementToOrSet}>Add</button>
        </div>
      </div>
  	);
  };

};

export default Content;
