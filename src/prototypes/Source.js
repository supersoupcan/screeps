const utils = require('utils');

module.exports = function(){
  function initExtraction(){
    return {
      type : 'source',
      source : {
        id : this.id,
        isSafe : isSafe.call(this),
        spaces : availableSpace.call(this),
      }
    }
  }
}();