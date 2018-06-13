const plan = require(plan);

module.exports = function(){
  function manageRooms(){
    _.forEach(Game.rooms, (room) => {
      if(_.isEmpty(roomMemory)){
        room.init();
      }
      if(room.memory.queue > 0 && room.energyCapacity === room.energyCapacityAvailable){
        _.forEach(room.find(FIND_MY_SPAWNS), (spawn) => {
          if(!spawn.spawning){
            spawn.construct()
            return false;
          }
        })
      }
    })
  }
  function manageCreeps(){
    _.forEach(Game.creeps, (creep) => {
      const creepRoom = Game.rooms[creep.memory.ownedBy];
      if(!creep.memory.goalIndex){
        creepRoom.checkForNewGoal(creep);
      }
      plan[creepRoom.controller.level].goals[creep.memory.goalIndex].job.run(creep);
    })
  }
  
  function run(){
    manageRooms();
    manageCreeps();
  }

  return {
    run : run
  }
}();