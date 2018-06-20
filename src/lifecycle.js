const plan = require('plan');
const role = require('role');

module.exports = function(){
  function manageRooms(){
    _.forEach(Game.rooms, (room) => {
      if(_.isEmpty(room.memory)){
        room.init();
      }else if(room.memory.level !== room.controller.level){
        room.initNextPlan();
      }

      //HANDLE SPAWNS
      if(room.memory.queue.length > 0 && !room.memory.nextBuild){
        let shift = role[room.memory.queue.shift()];
        room.memory.nextBuild = shift.createBuild(room.energyCapacityAvailable, false);
      }

      if(room.memory.nextBuild){
        if(room.energyAvailable >= room.memory.nextBuild.energyCost){
          const availableSpawn = _.find(room.find(FIND_MY_SPAWNS), (spawn) => {
            return !spawn.spawning;
          });
          if(availableSpawn){
            if(availableSpawn.construct(room.memory.nextBuild) === OK){
              console.log('spawning ' + room.memory.nextBuild.role 
              + ' for ' + room.memory.nextBuild.energyCost);
              room.memory.nextBuild = null;
            }else{
              console.log('catastrophic failure: this should never happen');
            }
          }
        }
      }

      /*
       _.forEach(room.find(FIND_MY_SPAWNS), (spawn) => {
          if(!spawn.spawning){
            spawn.construct()
            return false;
          }
        })
      */
    })
  }
  function manageCreeps(){
    _.forEach(Memory.creeps, (creepMemory, creepName) => {
      const creep = Game.creeps[creepName];
      const creepRoom = Game.rooms[creepMemory.ownedBy];
      if(!creep){
        console.log(creepName + ' has died');
        creepRoom.memory.queue.push(creepMemory.role);
        _.remove(creepRoom.memory.goal[creepMemory.goalIndex], (assignedTo) => (assignedTo === creepName));
        delete Memory.creeps[creepName];
      }else{
        if(!creep.spawning){
          if(!creep.memory.hasOwnProperty('goalIndex')){
            creepRoom.checkForNewGoal(creep);
          }
          creepRoom.controller.getPlan().goals[creep.memory.goalIndex].job.run(creep);
        }
      }
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