module.exports = function(){
  function init(){
    this.room.memory.controller[this.id] = {
      assignedTo : [],
    }
  }

  return({
    init : init,
  })
}();