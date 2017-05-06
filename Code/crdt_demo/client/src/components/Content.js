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
    console.log("Input: "+input)
    if(input){
      var operation = { element: { element: input, uniqueID: Math.floor(Math.random() * 1000000000)} , "add": true}
      this.setState({localOpORSet: this.state.localOpORSet.downstream(operation)});
      this.state.communicationComponent.sendToServer(this.state.localOpORSet, operation);
      this.setState({orInput: ""})
    }else{
      console.log("Please enter a value")
    }
  }

  removeElementFromORSet(orSet, elem){
    var operation = { element: elem, "add": false}
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
    for(var i = 0; i < elements.length; i++){
      var elementToRemove = elements[i]
      elementsToPresent.push(<li className="shoppingElement" key={elements[i].uniqueID}>{
          elements[i].element}
          <span>
            <button className={"boughtItemButton"} onClick={() => this.removeElementFromORSet(this.state.localOpORSet, elementToRemove)}><span className={"glyphicon glyphicon-check"}/></button>
            <button className={"decrementButton"} onClick={() => this.removeElementFromORSet(this.state.localOpORSet, elementToRemove)}><span className={"glyphicon glyphicon-minus"}/>
          </button>
          </span>
        </li>);
    }

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
          <button className={"incrementButton"} onClick={() => this.counterChanged(true)}><span className={"glyphicon glyphicon-plus"}></span></button>
          <button className={"decrementButton"} onClick={() => this.counterChanged(false)}><span className={"glyphicon glyphicon-minus"}></span></button>
          </span>
        </div>
        <br/><br/>
        <div>
          <ul className="shoppingList">{elementsToPresent}</ul>
          <div className="addElementToSetContainer">
          <input className="addShoppingItemField" type="text" value={this.state.orInput} onChange={this.handleInput} placeholder="Add item..."/>
          <button className={"incrementButton addItemBtn"} onClick={this.addElementToOrSet}><span className={"glyphicon glyphicon-plus"}></span></button>
          </div>
        </div>
      </div>
  	);
  };

};

export default Content;
