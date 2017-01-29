function TimestampRegister(defaultValue){
	this.value = defaultValue;
	this.timestamp = new Date();

	this.setValue = function(val, stamp){
		this.value = val
		this.timestamp = stamp
	};

	this.getValue = function(){
		return this.value
	};

	this.getTimeStamp = function(){
		return this.timestamp
	};


	this.mergeNewValue = function(val, stamp){
		if (stamp > this.timestamp){
			this.setValue(val, stamp);
			//console.log("Current value switched to "+val)
		}else{
			console.log(this.timestamp + " is a newer timestamp than " + stamp + ". Value won't change.")
		};
	};
};