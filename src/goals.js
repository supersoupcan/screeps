const job = require(job);

let Goal = function(name, job, priority, config){
  this.name = name;
  this.job = job;
  this.priority = priority;
  this.maximum = config.maximum || 99;
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
}


module.exports = {
  MaintainEnergy : function(){
    Goal.call(this, 'maintainEnergy', new job.Harvester(), (room) => 4);
  },
  MaintainController : function(){
    Goal.call(this, 'maintainController', new job.Upgrader(), (room) => 4);
  },
  UpgradeController : function(){
    Goal.call(this, 'upgradeController', new job.Upgrader(), (room) => 4);
  },
  BuildSite : function(structureType, priority){
    Goal.call(this, 'buildSite' + structureType, new job.Builder(structureType), priority);
    this.structureType = structureType;
  }
}
