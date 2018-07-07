const Job = require('models_Job');
const extraction = require('models_extraction');
const worksite = require('models_worksite');
const jobLogic = require('models_jobLogic');
const planner = require('models_planner');

const Goal = function(name, roles, operationalize){
  this.name = name;
  this.roles = roles;
  this.operationalize = operationalize;
}

Goal.prototype = function(){
  function getMemory(room){
    return room.memory.goals[this.name];
  }

  function initRoomMemory(room){
    let base = {};
    base.assignments = [];
    return base;
  }

  function dismissCreep(room, creep){
    const indexToRemove = _.findIndex(room.goals[this.name].assignments, (assignment) => {
      return (assignment.creepName === creep.name)
    })
    if(indexToRemove !== -1){
      room.goals[this.name].assignments.splice(indexToRemove, 1);
    }
    creep.job.dismissCreep(creep);
    creep.memory.goal = null;
  }

  function calculatePriority(room, creep){
    if(creep.memory.role in this.roles){
      const cf = this.operationalize(room, creep);
      const memory = getMemory.call(this, room); 
      const completeOn = cf.completeOn || false;
      const alreadyAssigned = _.includes(memory.assignments, creep.name);
      const assignedCount = alreadyAssigned ? memory.assignments.length - 1 
        : memory.assignments.length
      const demand = cf.demand || 0;
      const lowestRange = cf.lowestRange || 0;
      const assignedFactor = cf.assignedFactor || 1;
      const roleFactor = this.roles[creep.role].factor;
      const kill = cf.kill || false;


      if(completeOn){
        planner.completionCallback(room, this);
        return 0;
      }else if(kill){
        return 0;
      }
      return lowestRange + (demand - demand*lowestRange) * roleFactor / (1 + assignedCount * assignedFactor);
    }
    return 0;
  }

  const public = {
    initRoomMemory : initRoomMemory,
    dismissCreep : dismissCreep,
    calculatePriority : calculatePriority,
  }

  return Object.assign({}, public);
}();

const maintainEnergy = new Goal('maintainEnergy', {
  'hauler' : {
    priority : 1, 
    job : new Job(jobLogic.standard, extraction.haulerEnergy, worksite.energyMaintananceSite),
  },
  'worker' : {
    priority : 0.5,
    job : new Job(jobLogic.standard, extraction.workerEnergy, worksite.energyMaintananceSite),
  },
  function(room){
    return {
      demand: 1 - room.energyAvailable / room.energyCapacityAvailable,
      passive: 0.5,
      kill: (room.energyAvailable === room.energyCapacityAvailable),
    }
  }
})

const upgradeController = new Goal('upgradeController', {
  'worker' : {
    priority : 1,
    job : new Job(logic.standard, extraction.workerEnergy, worksite.upgradeSite),
  },
  'hauler' : {
    priority : 0.5,
    job : new Job(logic.standard, extraction.workerEnergy, worksite.upgradeSite),
  },
  function(room){
    return {
      completeOn : room.controller.level >= room.planner.controller.level,
      demand : 0.1,
      assignedFactor : 1.1,
    }
  }
});

const maintainController = new Goal('maintainController', {
  'worker' : {
    priority : 1,
    job : new Job(logic.standard, extraction.workerEnergy, worksite.upgradeSite),
  },
  'hauler' : {
    priority : 0.5,
    job : new Job(logic.standard, extractor.haulerEnergy, worksite.upgradeSite)
  },
  function(room){
    return {
      demand : room.controller.ticksToDowngrade <= 600 ? 1 : 0,
      assignedFactor : 100,
    }
  }
})

const builder = new Goal('build', {
  'hauler' : {
    priority : 1,
    job : new Job(logic.standard, extraction.haulerEnergy, worksite.buildSite)
  },
  'worker' : {
      priority : 0.5,
      job : new Job(logic.standard, extraction.workerEnergy, worksite.buildSite)
  }},
  function(room){
    return {
      completeOn : room.find(FIND_MY_CONSTRUCTION_SITES).length === 0,
      demand : 0.5,
      assignedFactor : 1.1
    }
  },
)


/*
const harvest = new Goal('harvest', {
  'miner' : {
    priority : 1,
    job : new Job(logic.miner, extraction.haulerEnergy)
  },
  function(room){
    return {

    }
  }
})
*/

moudule.exports = {
  maintainEnergy : maintainEnergy,
  maintainController : maintainController,
  upgradeController : upgradeController,
  builder : builder,
  harvest : harvest,
}