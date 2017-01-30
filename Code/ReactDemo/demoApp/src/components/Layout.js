import React from "react";

export default class Layout extends React.Component{

	constructor(){
		super();
		this.name = 'Hanna';
	}

	render(){
		return(
			<h1>Hi {this.name}</h1>
		);
	};



}