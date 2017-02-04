import React from "react";
import Header from './Header.js';
import Content from './Content.js';
import Footer from './Footer.js';

class Layout extends React.Component {
  render() {
  	return(
  		<div>
  			<Header/>
  			<Content/>
  			<Footer/>
  		</div>
  	);
  };

};


export default Layout;