var express = require('express');
var app = express();

app.get('/', function(req,res){
	res.send('Hello World');
})

app.listen(3000, function(){
	console.log('Demo Server is listening on port 3000');
	var timer = new TimestampRegister(false);
	console.log(timer);
	console.log(timer.getValue)
	console.log(timer.getTimeStamp)
	var testDate = new Date("2017-01-29T18:13:09.377Z");
	console.log(timer.mergeNewValue(true, new Date()));
	console.log(timer);
})



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