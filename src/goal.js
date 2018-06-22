let Goal = function(name, job, operationalizePriority, config){
  const cf = config || {};
  this.name = name;
  this.job = job;
  this.operationalizePriority = operationalizePriority;
  this.maximum = cf.maximum || 99;
}

Goal.prototype = function(){
  function initMemory(){  
    return ({
      assigned : []
    })
  }

  function dismiss(creep){
    const owner = Game.rooms[creep.memory.ownedBy];
    _.remove(
      owner.memory.goals[creep.memory.goalIndex],
      (goalMemory) => (goalMemory.assignedTo === creepName)
    )
    this.job.dismiss(creep);
  }

  function getPriority(room, goalMemory, alreadyHasThisGoal){
    let cf = this.operationalizePriority(room, goalMemory, alreadyHasThisGoal);

    const goalMemoryLength = goalMemory.assigned.length;

    const totalAssigned = cf.workers || alreadyHasThisGoal ? goalMemoryLength - 1 : goalMemoryLength;
    const demand = cf.demand || 0;
    const lowRange = cf.lowRange || 0;
    const kill = Boolean(cf.kill) || false;
    const assignmentFactor = cf.assignmentFactor || 1;

    if(kill){
      return 0;
    }else{
      return (lowRange + (demand - demand*lowRange) / (1 + totalAssigned * assignmentFactor));
    }
  }

  return {
    dismiss : dismiss,
    initMemory : initMemory,
    getPriority : getPriority,
}
}();

let MaintainEnergy = function(Job){
  Goal.call(
    this,
    'maintainEnergy', 
    new Job(),
    function(room, goalMemory, alreadyHasThisGoal){
      return {
        demand : (1 - room.energyAvailable / room.energyCapacityAvailable),
        lowRange: 0.5,
        kill: (room.energyAvailable === room.energyCapacityAvailable),
        assignmentFactor : 2,
      }
    }
  )
};

MaintainEnergy.prototype = Object.create(Goal.prototype);

let MaintainController = function(Job){
  Goal.call(this, 
    'maintainController', 
    new Job(),
    function(room, goalMemory, alreadyHasThisGoal){
      return {
        demand : (room.controller.ticksToDowngrade <= 600) ? 1 : 0,
        assignmentFactor : 10000,
      }
    }
  )
};

MaintainController.prototype = Object.create(Goal.prototype);

let UpgradeController = function(Job){
  Goal.call(this, 
    'upgradeController', 
    new Job(),
    function(room, goalMemory, alreadyHasThisGoal){
      return {
        demand : 0.25,
        assignmentFactor : 1.5,
      }
    }
  );
}
UpgradeController.prototype = Object.create(Goal.prototype);

let BuildSite = function(Job, structureType){
  Goal.call(
    this, 
    'buildSite' + structureType, 
    new Job(structureType),
    function(room, goalMemory, alreadyHasThisGoal){
      return {
        demand : 0.5
      }
    }
  );
  this.structureType = structureType;
}

BuildSite.prototype = Object.create(Goal.prototype);

module.exports = {
  MaintainEnergy : MaintainEnergy,
  MaintainController : MaintainController,
  UpgradeController : UpgradeController,
  BuildSite : BuildSite
}