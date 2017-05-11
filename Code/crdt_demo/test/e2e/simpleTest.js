var config = require('../../nightwatch.conf.BASIC.js');

module.exports = { // adapted from: https://git.io/vodU0
  'Increment the Counter': function(browser) {
    browser
      .url('http://10.200.1.63:3000/')
      .waitForElementVisible('body')
      .click('#myToggle').pause(100)

    var loops = 10
    for(var i=0;i<loops;i++){
      browser.click('#incrementCounter').pause(50)
    }

    browser
      .pause(1000)
  },

  'Write to the Textfield': function(browser) {
    var loops = 10
    for (var i=0;i<loops;i++){
      browser
        .setValue('#addItemField', 'nightwatch ' + i)
        .pause(200)
        .click('#addItemBtn')
    }
    browser
      .pause(1000)
  },

  'Trigger the Toggle': function(browser) {
      browser
      .waitForElementVisible('#myToggle')

    loops = 9
    for(var i=0;i<loops;i++){
      browser.execute(function() {
        var toggle = document.getElementById("myToggle")
        toggle.click()
      }).pause(100)
    }
    browser
      .pause(1000)
      .end();
  }
};
