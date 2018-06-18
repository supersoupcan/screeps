'use strict'


module.exports = function(){
  function construct(nextBuild){
    let msg = this.spawnCreep(
      nextBuild.body,
      nextBuild.role + '_' + Game.time,
      {
        memory : {
          role : nextBuild.role,
          ownedBy : this.room.name
        }
      }
    )
    return(
      msg
    )
  }

  return({
    construct : construct,
  });
}();

