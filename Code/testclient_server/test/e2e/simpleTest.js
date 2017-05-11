var config = require('../../nightwatch.conf.BASIC.js');

module.exports = { // adapted from: https://git.io/vodU0
  'User behaviour 1': function(browser) {
    console.log("Connect to the server and get the Webpage...")
    browser.url('http://10.200.1.63:3000/')
    .waitForElementVisible('body').pause(100)

    console.log("Yey, I have 10€ in my pocket. Add them to my budget")
    var budget = 10
    for(var i=0;i<budget;i++){
        browser.click('#incrementCounter').pause(50)
    }

    console.log("Hooray, not broke anymore")
    browser.click('#myToggle').pause(100)

    console.log("Mhm, I'm hungry and thirsty...")
    var items = ["Milk", "Sugar", "Candy", "Salad", "Cheese", "Halloumi", "A bottle of wine"]
    items.forEach(function(item){
        browser.setValue('#addItemField', item)
            .pause(200)
            .click('#addItemBtn')
        }
    })

    console.log("I did find 50€ on the street! Add them to the budget...")
    var budget = 50
    for(var i=0;i<budget;i++){
        browser.click('#incrementCounter').pause(50)
    }

    console.log("Oh so hungry, I bought a Kebap on my way to the supermarket. Price: 3€")
    var cost = 3
    for(var i=0;i<budget;i++){
        browser.click('#decrementCounter').pause(50)
    }

    console.log("Finally reached the market. But didn't find all products")
    var items = ["Halloumi", "Candy", "Milk", "Cheese"]


  },

  // 'Increment the Counter': function(browser) {
  //   browser
  //     .url('http://10.200.1.63:3000/')
  //     .waitForElementVisible('body')
  //     .click('#myToggle').pause(100)
  //
  //   var loops = 10
  //   for(var i=0;i<loops;i++){
  //     browser.click('#incrementCounter').pause(50)
  //   }
  //
  //   browser
  //     .pause(1000)
  // },
  //
  // 'Write to the Textfield': function(browser) {
  //   var loops = 10
  //   for (var i=0;i<loops;i++){
  //     browser
  //       .setValue('#addItemField', 'nightwatch ' + i)
  //       .pause(200)
  //       .click('#addItemBtn')
  //   }
  //   browser
  //     .pause(1000)
  // },
  //
  // 'Trigger the Toggle': function(browser) {
  //     browser
  //     .waitForElementVisible('#myToggle')
  //
  //   loops = 9
  //   for(var i=0;i<loops;i++){
  //     browser.execute(function() {
  //       var toggle = document.getElementById("myToggle")
  //       toggle.click()
  //     }).pause(100)
  //   }
  //   browser
  //     .pause(1000)
  //     .end();
  // }

};
