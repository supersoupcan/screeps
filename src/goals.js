const job = require('job');

function Goal(name, resource, worksite, priority){
  this.name = name;
}

Goal.prototype = function(){
  return({

  })
}


let harvest = {
  completable : false,
  extract : Creep.harvest,
  work : Creep.transfer,
  job : jobs[harvester],
  resource : RESOURCE_ENERGY,
  workSite : STRUCTURE_SPAWN || STRUCTURE_EXTENSIONS,
  priority : function(room){
    const passive = 4;
    (10 - room.energyAvailable / room.energyCapacityAvailable *10) + passive;
  },
}

let maintainController = {
  completable : false,
  extract : Creep.harvest,
  work : Creep.upgradeController,
  job : jobs[harvester],
  resource : RESOURCE_ENERGY,
  workSite : STRUCTURE_CONTROLLER,
  priority : function(room){
    const controller = room.controller;
    const passive = -5;
    const factor = 2;
    ((10 - controller.ticksToDownGrade / CONTROLLER_DOWNGRADE[controller.level] * 10) 
      - passive) * factor;
  }
}

let upgrade = {
  completable : true,
  extract : Creep.harvest,
  work : Creep.upgradeController,
  job : jobs[harvester],
  resource : RESOURCE_ENERGY,
  workSite : SRUCTURE_CONTROLLER,
  prority : function(room){

  }
}