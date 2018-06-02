'use strict'

const role = require('role');

module.exports = function(){

  let queue = [];

  function addToQueue(roleName){
    this.memory.queue.push(roleName);
  }

  function construct(){
    const roleName = this.memory.queue.shift();

    this.createCreep(
      role[roleName].build(),
      _.uniqueId(roleName + '_'),
      {
        memory : {
          role : roleName,
          origin : this.room,
        }
      }
    )
  }

  return({
    addToQueue : addToQueue,
    construct : construct,
    queue : queue,
  });
}();

