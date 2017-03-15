export function OpCounter(value=0){
	this.value = value;
	this.increase = undefined;

	this.increment = (function(){
		this.value += 1;
		this.increase = true
		console.log("Incremented");
		console.log(this.value)
		return this
	}).bind(this);

	this.decrement = (function(){
		this.value -= 1;
		this.increase = false
		console.log("Decremented");
		console.log(this.value)
		return this
	}).bind(this);

	this.getValue = (function(){
		return this.value;
	});

	this.mergeValue = (function(incomingCounter){
		if(incomingCounter.increase == true){
			this.increment();
		}else{
			this.decrement();
		}
		return this;
	}).bind(this);

};
