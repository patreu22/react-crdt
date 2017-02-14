import React from "react";
import "../css/Content.css"
import Toggle from "react-toggle"
import {TimestampRegister} from '../timestampRegister';

class Content extends React.Component {

  //Send initial Request for long polling
  componentDidMount(){
    console.log("Did mount");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/lp', true);
    xhr.setRequestHeader("Content-type", "text/plain");
    xhr.onreadystatechange = (function() {//Call a function when the state changes.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
         console.log('Long Polling started');
         console.log('Response Text:');
         console.log(xhr.responseText);
         this.updateTimestampRegister(JSON.parse(xhr.responseText));
      };
    }).bind(this);
    xhr.send();
    console.log("Long Polling Request sent");
  };


  updateTimestampRegister(register){
    console.log("+++Now updating Timestamp+++")
  };

  toggleChanged(isChecked){
    //Create a new Register
    var register = new TimestampRegister(isChecked);

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
    xhr.send(JSON.stringify(register));
  };



  //What is shown in the browser
  render() {
  	return(
  		<div className="Content">
  			<label>
  				<br/>
  				<Toggle
    				defaultChecked={false}
    				icons={false}
    				onChange={(myToggle) => this.toggleChanged(myToggle.target.checked)} />
			</label>
  		</div>
  	);
  };

};






export default Content;