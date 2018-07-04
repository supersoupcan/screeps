const roles = require('models_roles');

module.exports = function(){
  function main(){
    manageRooms();
    manageCreeps();
  }

  function manageRooms(){
    _.forEach(Game.rooms, (room, roomName) => {
      if(_.isEmpty(room.memory)){
        room.init();
      }else if(room.memory.level !== room.controller.level){
        room.levelChange();
      }

      if(room.memory.queue.length > 0 && !room.memory.nextSpawn){
        const nextSpawnRole = role[room.memory.queue.shift()];
        room.memory.nextSpawn = nextSpawnRole.create(room.energyCapacityAvailable, false);
      }

      if(room.memory.nextSpawn){
        if(room.energyAvailable >= room.memory.nextSpawn.energyCost){
          const availableSpawns = room.find(
            FIND_MY_SPAWNS, { 
            filter : (spawn) => {
              return !spawn.spawning;
          }})

          if(availableSpawns.length > 0){
            const chosenSpawn = availableSpawns[0];
            if(chosenSpawn.construct(room.memory.nextSpawn) === OK){
              room.memory.nextSpawn = null;
            }
          }
        }
      }
    })
  };

  function manageCreeps(){
    _.forEach(Memory.creeps, (creepMemory, creepName) => {
      const creep = Game.creeps[creepName];
      const room = creep.owner;
      if(!creep){
        if(creep.goal){
          creep.goal.dismiss(creep);
          creep.job.dismiss(creep);
          delete Memory.creeps[creepName];
        }
        room.populateQueue();
      }
    })
  }



  return{
    main : main,
  }
}