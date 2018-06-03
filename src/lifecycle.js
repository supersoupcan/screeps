const job = require('job');

module.exports = function(){
  
  function main(){
    manageRooms();
    manageCreeps();
  }

  function manageCreeps(){
    _.forEach(Game.creeps, function(creep, index){
      if(creep.memory === null){
        creep.init();
      }
      if(!creep.spawning){
        if(!creep.memory.jobName){
          creep.setJob();
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