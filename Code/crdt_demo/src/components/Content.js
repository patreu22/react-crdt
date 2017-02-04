import React from "react";
import "../css/Content.css"
import Toggle from "react-toggle"

class Content extends React.Component {
  
  toggleChanged(){
  	console.log("Toggled");
    //send XHTTP Request here...
  }

  render() {
  	return(
  		<div className="Content">
  			<label>
  				<br/>
  				<Toggle
    				defaultChecked={false}
    				icons={false}
    				onChange={this.toggleChanged} />
			</label>
  		</div>
  	);
  };

};


export default Content;