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

  orSetChanged(add){
    var operation = { element: "Hello","add": add}
    console.log("Local" +JSON.stringify(this.state.localOpORSet))
    this.setState({localOpORSet: this.state.localOpORSet.downstream(operation)});
    this.state.communicationComponent.sendToServer(this.state.localOpORSet, "opORSet", operation);
  }

  //What is shown in the browser
  //<ol>{elementsToPresent}</ol>
  render() {
    var elementsToPresent = [];
    var elements = this.state.localOpORSet.valueSet
    for(var i = 0; i < elements.length; i++){
      elementsToPresent.push(<li key={elements[i].uniqueID}>{elements[i].element}</li>);
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
          <button onClick={() => this.orSetChanged(true)}>Add</button>
          <button onClick={() => this.orSetChanged(false)}>Remove</button>
        </div>
      </div>
  	);
  };

};

export default Content;
