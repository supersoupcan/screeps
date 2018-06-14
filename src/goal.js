const job = require('job');

let Goal = function(name, job, priority, config){
  const cf = config || {};
  this.name = name;
  this.job = job;
  this.priority = priority;
  this.maximum = cf.maximum || 99;
}

Goal.prototype = function(){
  function initMemory(room){
    return ({
      assigned : []
    })
  }

  return {
    initMemory : initMemory
  }
}();

let MaintainEnergy = function(){
  Goal.call(this, 'maintainEnergy', new job.Harvester(), (room) => 4);
};
MaintainEnergy.prototype = Object.create(Goal.prototype);

let MaintainController = function(){
  Goal.call(this, 'maintainController', new job.Upgrader(), (room) => 3);
};
MaintainController.prototype = Object.create(Goal.prototype);

let UpgradeController = function(){
  Goal.call(this, 'upgradeController', new job.Upgrader(), (room) => 5);
}
UpgradeController.prototype = Object.create(Goal.prototype);

let BuildSite = function(structureType, priority){
  Goal.call(this, 'buildSite' + structureType, new job.Builder(structureType), priority);
  this.structureType = structureType;
}
BuildSite.prototype = Object.create(Goal.prototype);

module.exports = {
  MaintainEnergy : MaintainEnergy,
  MaintainController : MaintainController,
  UpgradeController : UpgradeController,
  BuildSite : BuildSite
}