module.exports = function OpORSet(name){

this.valueSet = []
this.name = name

this.setUSet = function(setValue){
  console.log("Set value: "+setValue)
  this.valueSet = setValue
  return this
}

this.lookup = function(e){
  if (this.valueSet.indexOf(e) >= 0){
    return true
  }else{
    return false
  }
}


this.setUniqueId = function(e){
  var elem = {
      "element" : e,
      "uniqueID" : Math.floor(Math.random() * 1000000000)
  }
  return elem
}

this.add = function(e){
    this.valueSet.push(this.setUniqueId(e))
}

this.remove = function(e){
  if(this.lookup(e)){
    this.valueSet.splice(this.valueSet.indexOf(e), 1)
  }else{
    console.log("Can't remove. Element is not in the set.")
  }
}

this.downstream = function(operation){
  if(operation.add){
    this.add(operation.element)
  }else{
    this.remove(operation.element)
  }
  console.log("After downstream: "+JSON.stringify(this))
  return this
}

}
