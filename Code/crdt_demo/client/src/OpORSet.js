module.exports = function OpORSet(name){

this.valueSet = []
this.name = name

this.setValue = function(setValue){
  console.log("Set value: "+setValue)
  this.valueSet = setValue
  return this
}

this.lookup = function(e){
  console.log("Element to lookup: "+JSON.stringify(e))
  var foundIt = false
  this.valueSet.forEach(function(element){
    if(JSON.stringify(element) === JSON.stringify(e)){
      foundIt = true
    }
  })
  if (foundIt){
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
    console.log("###e: "+JSON.stringify(e))
    if (typeof e === 'object'){
      console.log("Hey, it's an object")
      if(e.uniqueID === undefined){
        console.log("No unique ID. Setting one for object.")
        this.valueSet.push(this.setUniqueId(e))
      }else{
        console.log("Unique ID found. Push to Set.")
        this.valueSet.push(e)
      }
    }else{
      console.log("Simple data structure. Append Unique ID.")
      this.valueSet.push(this.setUniqueId(e))
    }
}

this.remove = function(e){
  console.log("Complete Value Set: "+JSON.stringify(this.valueSet))
  console.log("Element to remove: "+JSON.stringify(e))
  console.log("Lookup successful: "+this.lookup(e))
  if(this.lookup(e)){
    console.log("Let's check that filthy Array")
    this.valueSet.forEach(function(element, index){
      console.log("Current element: "+JSON.stringify(element))
      if(JSON.stringify(element) === JSON.stringify(e)){
        this.valueSet.splice(index,1)
      }
    }, this)
  }else{
    console.log("Can't remove. Element is not in the set.")
  }
}

this.downstream = function(operation){
  console.log("Operation: "+JSON.stringify(operation))
  if(operation.add){
    this.add(operation.element)
  }else{
    this.remove(operation.element)
  }
  console.log("After downstream: "+JSON.stringify(this))
  return this
}

}
