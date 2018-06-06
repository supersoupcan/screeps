const job = require('job');

function Goal(room, name, role, isCompletable, job){
  this.room = room;
  this.name = name;
  this.role = role;
  this.isCompletable = isCompletable;
  //this.findPriority = findPriority;
}

Goal.prototype = function(){
  function initMemory(){
    
  }

  function assign(creep){

  }

  return({
    init : init,
  })
}

const maintainEnergy = new Goal('maintainEnergy', 'worker', false, job.harvester);






/*
let harvest = {
  completable : false,
  transfer : RESROUCE_ENERGY,
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

*/