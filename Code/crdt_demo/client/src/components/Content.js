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
      communicationComponent: new CommunicationComponent(this),
      localTimestampRegister: new TimestampRegister("timestampDemo", false),
      localOpCounter: new OpCounter("counterDemo")
    };
    this.state.communicationComponent.addCRDT(this.state.localTimestampRegister)
    this.state.communicationComponent.addCRDT(this.state.localOpCounter)
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
