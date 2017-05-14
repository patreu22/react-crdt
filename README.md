# React CRDT
 
### What is this about? 
`react-crdt` is part of a bachelor thesis dealing with conflict-free data types in web development. 
It is a npm package for embedding conflict-free replicated data types into your project. 
Currently it only works with React but for the future it should be continued. 
If you don't know yet what CRDTs are you can get a fast introduction here: https://vaughnvernon.co/?p=1012


### Try the Demo 
 
<img src="https://github.com/patreu22/react-crdt/blob/master/img/chrome_screenshot.png"  width="300" height="320"/> 
 
I implemented a shopping cart driven by a set of CRDTs for demo reasons. You can use a toggle for setting a LWW-Register, 
increment/decrement a PN-Counter and add or remove elements to/from a Observed-Removed set. 


### How to setup the demo on your local machine
1. Get the project: `git clone https://github.com/patreu22/react-crdt`
2. Navigate to the demo folder: `cd crdt_demo`
3. Install all necessary dependencies: `npm install`
4. Run the application: `node server.js`
5. Enter your browser and go to `localhost:3000`
 
 
### How to setup the package
1. Install the package: `npm install react-crdt`
2. Require it in one of your components: `var crdt = require("react-crdt")`
3. Setup the communication component and the CRDTs you want to use in the constructor:
```
this.state = {
  communicationComponent: new crdt.CommunicationComponent(this),
  localLwwRegister: new crdt.OpLwwRegister("lwwDemo", false),
  localOpCounter: new crdt.OpCounter("counterDemo")
}
```
4. Add the initialized CRDTs to the Communication Component: 
```
this.state.communicationComponent.addCRDT(this.state.localLwwRegister)
this.state.communicationComponent.addCRDT(this.state.localOpCounter)
```
5. Setup the API routes to the server and start the communication:
```
this.state.communicationComponent.setupApiRoutes("/api", "/api/initial", "/api/lp")
this.state.communicationComponent.start()
```

You can now start to use the defined CRDTs. You have to make sure that everytime the user changes the value of a CRDT you have to make sure to call the downstream function of the CRDT and send it to the server through the communication component. 
Quick Example: 
```
  counterChanged(increase){
    var operation = {"increase": increase}
    this.setState({localOpCounter: this.state.localOpCounter.downstream(operation)});
    this.state.communicationComponent.sendToServer(this.state.localOpCounter, operation);
  };
``` 

