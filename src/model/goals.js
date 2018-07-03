const Job = require('model_Job');
const extraction = require('model_extraction');

const Goal = function(name, roles, operationalize){
  this.name = name;
  this.roles = roles;
  this.operationalize = operationalize;
}

Goal.prototype = function(){
  function init(room){
    room.goals[this.name] = {
      assignment : []
    };
  }

  function remove(room, creep){
    const indexToRemove = _.findIndex(room.goals[this.name].assigned, (goal) => {
      return (goal.creepName === creep.name)
    })
    if(indexToRemove !== -1){
      room.goals[this.name].assignments.splice(indexToRemove, 1);
    }
    creep.goal = null;
  }

  function isCurrentlyAssigned(room, creep){
    return _.includes(room.memory.goals[creep.goal].assignment, creep.name);
  }

  function getPriority(room, creep){
    if(creep.role in this.roles){
      const cf = this.operationalize(room, creep);
      const goalMemory = room.memory.goals[this.name];
      const alreadyAssigned = _.includes(goalMemory.assignments, creep.name);
      const assignedCount = alreadyAssigned ? goalMemory.assignments.length - 1 
        : goalMemory.assignments.length
      const demand = cf.demand || 0;
      const lowestRange = cf.lowestRange || 0;
      const assignedFactor = cf.assignedFactor || 1;
      const roleFactor = this.roles[creep.role].factor;
      const kill = cf.kill || false;

      if(kill){
        return 0;
      }
      return lowestRange + (demand - demand*lowestRange) * roleFactor / (1 + assignedCount * assignedFactor);
    }
    return 0;
  }

  const public = {
    init : init,
    remove : remove,
    getPriority : getPriority,
  }

  return Object.assign({}, public);
}();

const maintainEnergy = new Goal('maintainEnergy', {
  'hauler' : {
    factor : 1,
    job : new Job(logic.standard, haulerEnergy,),
  },
  'worker' : {
    factor : 0.5,
    job : new Job(logic.standard, workerEnergy),
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
    value : 1,
    job : new Job(logic.standard, haulerEnergy,),
  },
  'builder' : {
    value : 0.5,
    job : new Job(logic.standard, workerEnergy),
  }
})

moudule.exports = {
  maintainEnergy : maintainEnergy,
  upgradeController : upgradeController,
}