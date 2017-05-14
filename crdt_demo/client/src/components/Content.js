import "../css/Content.css"
import Toggle from "react-toggle"
var React = require("react");
var crdt = require("react-crdt")


class Content extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      communicationComponent: new crdt.CommunicationComponent(this),
      localLwwRegister: new crdt.OpLwwRegister("lwwDemo", false),
      localOpCounter: new crdt.OpCounter("counterDemo"),
      localOpORSet: new crdt.OpORSet("orSetDemo"),
      orInput: ''
    };
    this.state.communicationComponent.addCRDT(this.state.localLwwRegister)
    this.state.communicationComponent.addCRDT(this.state.localOpCounter)
    this.state.communicationComponent.addCRDT(this.state.localOpORSet)
    this.state.communicationComponent.setupApiRoutes("/api", "/api/initial", "/api/lp")
    this.state.communicationComponent.start()
  };

  counterChanged(increase){
    var operation = {"increase": increase}
    this.setState({localOpCounter: this.state.localOpCounter.downstream(operation)});
    this.state.communicationComponent.sendToServer(this.state.localOpCounter, operation);
  };

  toggleChanged(isChecked){
    var operation = {value: isChecked, timestamp: new Date().getTime()}
    this.setState({localTimestampRegister: this.state.localLwwRegister.downstream(operation)});
    this.state.communicationComponent.sendToServer(this.state.localLwwRegister, operation);
  };

  addElementToOrSet = () =>{
    var input = this.state.orInput
    if(input){
      var operation = { element: { element: input, uniqueID: Math.floor(Math.random() * 1000000000)} , "add": true}
      console.log(JSON.stringify(operation))
      this.setState({localOpORSet: this.state.localOpORSet.downstream(operation)});
      this.state.communicationComponent.sendToServer(this.state.localOpORSet, operation);
      this.setState({orInput: ""})
    }else{
      console.log("Please enter a value")
    }
  }

  removeElementFromORSet(orSet, elem){
    var idsToRemove = this.state.localOpORSet.getIDsToRemove(elem)
    var operation = { element: idsToRemove, "add": false}
    this.setState({localOpORSet: this.state.localOpORSet.downstream(operation)});
    this.state.communicationComponent.sendToServer(this.state.localOpORSet, operation);
  }

  handleInput = (event) => {
    this.setState({orInput: event.target.value}, function(){
    })
  }

  render() {
    var elementsToPresent = [];
    //var elements = this.state.localOpORSet.valueSet
    var elements = this.state.localOpORSet.setToDisplay()
    console.log("++++++++Elements: ")
    console.log(elements)
    var myMap = elements.map((element) =>
      <li className="shoppingElement" id={"item"+element.element} key={element.uniqueID}>{element.element}
      <span>
        <button id={"bought"+element.element}className={"boughtItemButton"} onClick={() => this.removeElementFromORSet(this.state.localOpORSet, element)}><span className={"glyphicon glyphicon-check"}/></button>
        <button id={"bought"+element.element} className={"decrementButton"} onClick={() => this.removeElementFromORSet(this.state.localOpORSet, element)}><span className={"glyphicon glyphicon-minus"}/></button>
      </span>
      </li>
    )
  	return(
  		<div className="Content">
          <div className="toggleContainer">
            <label htmlFor="myToggle" className="toggleLabel">Out of money?</label>
    				<Toggle id="myToggle"
      				icons={false}
              checked = {this.state.localLwwRegister.value}
      				onChange={
                (myToggle) => this.toggleChanged(myToggle.target.checked)} />
          </div>
          <br/>
        <div className="counterContainer">
          <label className="labelForCounter" htmlFor="myCounter">Budget for this month:</label>
          <span id="myCounter">
          <label className={"counterLabel"}>{this.state.localOpCounter.value}€</label>
          <button id="incrementCounter" className={"incrementButton"} onClick={() => this.counterChanged(true)}><span className={"glyphicon glyphicon-plus"}></span></button>
          <button id="decrementCounter" className={"decrementButton"} onClick={() => this.counterChanged(false)}><span className={"glyphicon glyphicon-minus"}></span></button>
          </span>
        </div>
        <br/><br/>
        <div>
          <ul className="shoppingList">{myMap}</ul>
          <div className="addElementToSetContainer">
          <input id="addItemField" className="addShoppingItemField" type="text" value={this.state.orInput} onChange={this.handleInput} placeholder="Add item..."/>
          <button id="addItemBtn" className={"incrementButton addItemBtn"} onClick={this.addElementToOrSet}><span className={"glyphicon glyphicon-plus"}></span></button>
          </div>
        </div>
      </div>
  	);
  };

};

export default Content;
