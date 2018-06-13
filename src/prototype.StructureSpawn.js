'use strict'

const role = require('role');


module.exports = function(){
  function construct(){
    const roleName = this.memory.queue.shift();
    this.createCreep(
      role[roleName].build(this.room.energyAvailable, false),
      _.uniqueId(roleName + '_'),
      {
        memory : {
          role : roleName,
          ownedBy : this.room
        }
      }
    )
  }

  return({
    construct : construct,
  });
}();

