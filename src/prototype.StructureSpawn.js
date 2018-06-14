'use strict'

const role = require('role');


module.exports = function(){
  function construct(){
    const roleName = this.room.memory.queue.shift();
    let err = this.spawnCreep(
      role[roleName].body.build(this.room.energyAvailable, false),
      _.uniqueId(roleName + '_'),
      {
        memory : {
          role : roleName,
          ownedBy : this.room.name
        }
      }
    )

    console.log(err);

  }

  return({
    construct : construct,
  });
}();

