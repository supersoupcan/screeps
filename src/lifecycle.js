const job = require('job');

module.exports = function(){
  
  function main(){
    manageRooms();
    manageCreeps();
  }

  function manageCreeps(){
    _.forEach(Game.creeps, function(creep, creepName){
      if(!creep.spawning){
        if(!creep.memory.jobName){
          creep.room.findJob(creep);
        }
        _.assign(creep, job[creep.memory.jobName])
        
        
        //creep.init();
      }
    });
  }

  function manageRooms(){
    _forEach(Game.rooms, function(room, index){
      if(room.memory === null){
        room.init();
      }
    })
  }

  return({
    main : main
  });

}();