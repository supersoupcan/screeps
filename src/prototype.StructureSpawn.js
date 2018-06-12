'use strict'

const role = require('role');

module.exports = function(){
  function construct(isRoad){
    const roleName = this.memory.queue.shift();

    this.createCreep(
      role[roleName].build(this.room.energyAvailable, isRoad),
      _.uniqueId(roleName + '_'),
      {
        memory : {
          role : roleName,
        }
      }
    )
  }

  return({
    construct : construct,
  });
}();

