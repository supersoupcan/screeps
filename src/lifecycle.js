const roles = require('models_roles');
const lists = require('lists');

module.exports = function(){
  function main(){
    manageRooms();
    manageCreeps();
  }

  function manageRooms(){
    _.forEach(Game.rooms, (room, roomName) => {
      if(_.isEmpty(room.memory)){
        room.init();
      }

      if(room.memory.spawn.queue.length > 0 && !room.memory.spawn.next){
        const nextSpawnRole = role[room.memory.spawn.queue.shift()];
        room.memory.spawn.next = nextSpawnRole.create(
          room.energyCapacityAvailable, false
        );
      }

      if(room.memory.spawn.next){
        if(room.energyAvailable >= room.memory.spawn.next.energyCost){
          const availableSpawns = room.find(
            FIND_MY_SPAWNS, { 
            filter : (spawn) => {
              return !spawn.spawning;
          }})

          if(availableSpawns.length > 0){
            const chosenSpawn = availableSpawns[0];
            if(chosenSpawn.construct(room.memory.spawn.next) === OK){
              room.memory.spawn.next = null;
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
        if(creep.memory.goal){
          creep.goal.dismissCreep(creep);
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