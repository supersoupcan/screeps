module.exports = function(){
  function construct(nextSpawn){
    return this.spawnCreep(
      nextSpawn.body,
      nextSpawn.role + '_' + Game.time,
      {
        memory : {
          role  : nextSpawn.role,
          ownedBy : this.room,
          job : null,
          goal : null,
        }
      }
    )
  }
  return {
    construct : construct
  }
}();