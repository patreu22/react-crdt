var config = require('../../nightwatch.conf.BASIC.js');

module.exports = { // adapted from: https://git.io/vodU0
  'Increment the Counter': function(browser) {
    browser
      .url('http://10.200.1.63:3000/')
      .waitForElementVisible('body')
      .waitForElementVisible('button:nth-child(1)', 1000)
      .click('button:nth-child(1)')
      .pause(1000)
      .saveScreenshot('screenshots/crdtTest.png')
      .end();
  },

  'Adding something to the textfield': function(browser) {

    browser
      .url('http://10.200.1.63:3000/')
      .waitForElementVisible('body')
      .setValueAndTrigger('.addShoppingItemField:nth-child(1)', 'nightwatch')
      .pause(1000)
      .waitForElementVisible('.incrementButtonAddItemBtn:nth-child(1)')
      .click('button:nth-child(1)')
      .pause(1000)
      .saveScreenshot('screenshots/crdtTest.png')
      .end();
  }
};
//

//
// //Write elements in the set
// var tf = document.getElementsByClassName("addShoppingItemField")[0];
// var addBtn = document.getElementsByClassName("addItemBtn")[0];
// var executions = 10
//
// for(var i=0;i<executions;i++){
//     tf.value = "Product "+i;
//     var event = new Event('input', { bubbles: true });
//     tf.dispatchEvent(event)
//     addBtn.click()
// }
