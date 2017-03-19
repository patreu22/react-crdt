import React from "react";
import "../css/Content.css"
import Toggle from "react-toggle"
import {TimestampRegister} from '../TimestampRegister';
import {CommunicationComponent} from '../CommunicationComponent';
import {OpCounter} from '../OpCounter';

class Content extends React.Component {

  var communicationComponent;

  //Set initial localTimestampRegister
  constructor(props){
    super(props);
    this.state = {
      localTimestampRegister: new TimestampRegister(false),
      localOpCounter: new OpCounter()
    };
    communicationComponent = new CommunicationComponent()
    communicationComponent.addCRDT(this.state.localTimestampRegister)
    communicationComponent.addCRDT(this.state.localOpCounter)
    console.log("communicationComponent: "+ communicationComponent)
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

         //Das hier muss allgemeiner sein!!!
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
    this.getInitialStateFor(this.state.localTimestampRegister);
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
    communicationComponent.sendToServer(this.state.localOpCounter);
  }

  toggleChanged(isChecked){
    //Update Local Register
    this.setState({localTimestampRegister: this.state.localTimestampRegister.downstream(new TimestampRegister(isChecked))});
    communicationComponent.sendToServer(this.state.localTimestampRegister);
  };


  getInitialStateFor(crdt){
    communicationComponent.getInitialStateFromServer(crdt, '/api/initial')
  }




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
