const plan = require('plan');

module.exports = function(){
  function init(){
    
  }

  function getPlan(){
    return plan[this.level];
  }

  return({
    init : init,
    getPlan : getPlan
  })
}();