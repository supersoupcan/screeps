'use strict'


module.exports = function(){
  function construct(nextBuild){
    return this.spawnCreep(
      nextBuild.body,
      nextBuild.role + '_' + Game.time,
      {
        memory : {
          role : nextBuild.role,
          ownedBy : this.room.name
        }
      }
    )
  }

  return({
    construct : construct,
  });
}();

