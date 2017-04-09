module.exports =  function OpCounter(name, value=0){
	this.name = name
	this.value = value;

	this.setValue = (function(val){
		console.log("Value to set: "+val)
		this.value = val
		return this
	}).bind(this);

	this.increment = (function(){
		this.value += 1;
		console.log("Incremented");
		console.log(this.value)
		return this
	}).bind(this);

	this.decrement = (function(){
		this.value -= 1;
		console.log("Decremented");
		console.log(this.value)
		return this
	}).bind(this);

	this.getValue = (function(){
		return this.value;
	});

	this.getName = function(){
		return this.name;
	}

	this.downstream = (function(operation){
		if(operation.increase){
			this.increment();
		}else{
			this.decrement();
		}
		return this;
	}).bind(this);

};
