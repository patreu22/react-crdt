export function TimestampRegister(defaultValue, date = new Date().getTime()){
	this.value = defaultValue;
	this.timestamp = date;

	this.setValue = (function(val, stamp){
		this.value = val;
		this.timestamp = stamp;
	});

	this.getValue = (function(){
		return this.value;
	});

	this.getTimeStamp = (function(){
		return this.timestamp;
	});

	this.mergeNewValue = (function(incomingRegister){
		if (incomingRegister.timestamp > this.timestamp){
			this.setValue(incomingRegister.value, incomingRegister.timestamp);
			console.log("Current value switched to "+this.value);
		}else{
			console.log(this.timestamp + " is a newer timestamp than " + incomingRegister.timestamp + ". Value won't change.");
		};
		return this;
	}).bind(this);
};
