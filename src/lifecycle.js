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

        //_.assign(creep, job[creep.memory.jobName])
        
        
        //creep.init();
      }
    });
  }

  function manageRooms(){
    _.forEach(Game.rooms, function(room, key){
      if(_.isEmpty(room.memory)){
        room.init();
      }
      
      //room.manageGoals();
    });
  }

  return({
    main : main
  });

}();