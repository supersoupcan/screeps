const plan = require('plan');

module.exports = function(){
  function manageRooms(){
    _.forEach(Game.rooms, (room) => {
      if(_.isEmpty(room.memory)){
        room.init();
      }
      if(room.memory.queue.length > 0 && room.energyAvailable === room.energyCapacityAvailable){
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
      if(!creep.hasOwnProperty('goalIndex')){
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