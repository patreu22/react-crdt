export function OpCounter(name, value=0){
	this.name = name
	this.value = value;

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

	this.downstream = (function(shouldIncrement){
		if(shouldIncrement == true){
			this.increment();
		}else{
			this.decrement();
		}
		return this;
	}).bind(this);

};
