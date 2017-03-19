export function TimestampRegister(name, defaultValue, date = new Date().getTime()){
	this.name = name
	this.value = defaultValue
	this.timestamp = date;

	this.setRegister = (function(val, stamp){
		this.value = val;
		this.timestamp = stamp;
		return this
	});

	this.getName = function(){
		return this.name;
	}

	this.getValue = (function(){
		return this.value;
	});

	this.getTimeStamp = (function(){
		return this.timestamp;
	});

	this.downstream = (function(incomingRegister){
		if (incomingRegister.timestamp > this.timestamp){
			this.setRegister(incomingRegister.value, incomingRegister.timestamp);
			console.log("Current value switched to "+this.value);
		}else{
			console.log(this.timestamp + " is a newer timestamp than " + incomingRegister.timestamp + ". Value won't change.");
		};
		return this;
	}).bind(this);
};
