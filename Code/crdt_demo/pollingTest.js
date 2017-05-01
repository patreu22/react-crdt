//Test for a lot of incrementing the counter
var btns = document.getElementsByTagName("button")
var btn1 = btns[0]
var btn2 = btns[1]

var executions = 300

for(var i=0;i<executions;i++){
  btn1.click()
}


//Write elements in the set
var tf = document.getElementsByClassName("addShoppingItemField")[0]
var addBtn = document.getElementsByClassName("addItemBtn")[0]
var executions = 10

for(var i=0;i<executions;i++){
    tf.value = "Product "+i
    addBtn.click()
}
