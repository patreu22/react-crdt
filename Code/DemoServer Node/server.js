var express = require('express');
var app = express();

app.get('/', function(req,res){
	res.send('<h1>Hello World</h1>');
})

app.listen(3000, function(){
	console.log('Demo Server is listening on port 3000');
	
	testRegister();
})

function testRegister(){
	var	registerFromClient = new TimestampRegister(true, new Date("2017-01-29T18:13:09.377Z"))
	var register = new TimestampRegister(false);
	console.log(register);
	console.log(register.getValue)
	console.log(register.getTimeStamp)
	console.log(register.mergeNewValue(registerFromClient));
	console.log(register);
}

function TimestampRegister(defaultValue, date = new Date()){
	this.value = defaultValue;
	this.timestamp = date;

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


	this.mergeNewValue = function(incomingRegister){
		if (incomingRegister.timestamp > this.timestamp){
			this.setValue(incomingRegister.value, incomingRegister.timestamp);
			console.log("Current value switched to "+val)
		}else{
			console.log(this.timestamp + " is a newer timestamp than " + incomingRegister.timestamp + ". Value won't change.")
		};
	};
};


/**
TimestampRegister.prototype.setValue = function(val, stamp){
		this.value = val
		this.timestamp = stamp
	};

TimestampRegister.prototype.getValue = function(){
		return this.value
	};

TimestampRegister.prototype.getTimeStamp = function(){
		return this.timestamp
	};


TimestampRegister.prototype.mergeNewValue = function(val, stamp){
		if (stamp > this.timestamp){
			this.setValue(val, stamp);
		};
	}; **/