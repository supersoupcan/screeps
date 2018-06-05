module.exports = function(){
  let memory = this.room.memory.controller[this.id];

  function init(){
    memory = {
      assignedTo : [],
    }
  }

  return({
    init : init,
  })
}();