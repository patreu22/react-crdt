import React from "react";
import "../css/Content.css"
import Toggle from "react-toggle"
import {TimestampRegister} from '../TimestampRegister';
import {OpCounter} from '../OpCounter';

class Content extends React.Component {

  //Set initial localTimestampRegister
  constructor(props){
    super(props);
    this.state = {
      localTimestampRegister: new TimestampRegister(false),
      localOpCounter: new OpCounter(5)
    };
    console.log(this.state)
    console.log("TimestampRegister: "+this.state.localTimestampRegister.value)
    console.log("OpCounter: "+this.state.localOpCounter.value)
  }


  //Setup long polling
  longPolling(){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/lp', true);
      xhr.setRequestHeader("Content-type", "text/plain");
      xhr.onreadystatechange = (function() {//Call a function when the state changes.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
         console.log('Response Text:');
         console.log(xhr.responseText);
         this.updateTimestampRegister(JSON.parse(xhr.responseText));
         this.longPolling();
         //Force the toggle to change if pushed by a Server
         //Das ist falscht
         //this.setState({time: localTimestampRegister.value});
      };
    }).bind(this);
      xhr.send();
      console.log("New long polling request sent");
  }


  //Send initial Request for long polling
  componentDidMount(){
    this.longPolling();
  };


  updateTimestampRegister(register){
    this.setState({localTimestampRegister: this.state.localTimestampRegister.mergeNewValue(register)});
  };

  updateOpCounter(increase){
    if (increase){
      this.setState({localOpCounter: this.state.localOpCounter.increment()});
    }else{
      this.setState({localOpCounter: this.state.localOpCounter.decrement()});
    }

    // //Send changed Object to Server
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', '/api', true);
    // xhr.setRequestHeader("Content-type", "application/json");
    // xhr.onreadystatechange = function() {//Call a function when the state changes.
    //   if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
    //      console.log("###Counter changed POST request sent###");
    //      console.log("Counter Status is now: "+ this.state.localOpCounter.value);
    //   };
    // };
    // xhr.send(JSON.stringify(this.state.localOpCounter));


  }

  toggleChanged(isChecked){
    //Update Local Register
    this.updateTimestampRegister(new TimestampRegister(isChecked));

    //Send changed Object to Server
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api', true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {//Call a function when the state changes.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
         console.log("###Toggle changed POST request sent###");
         console.log("Toggle Status is now: "+ isChecked);
      };
    };
    xhr.send(JSON.stringify(this.state.localTimestampRegister));
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
          <button onClick={() => this.updateOpCounter(true)}>Increment</button>
          <button onClick={() => this.updateOpCounter(false)}>Decrement</button>
        </div>
      </div>
  	);
  };

};






export default Content;
