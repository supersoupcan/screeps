const extraction = require('extraction');

const ExtractorWorker = function(name, role, extraction, work, workSite){
  this.name = name;
  this.role = role;
  this.extraction = extraction;
  this.work = work;
  this.workSite = workSite;
}

ExtractorWorker.prototype = function(){
  function init(creep, goalIndex){
    console.log('initializing ' + creep.name + ' for ' + this.name);
    const owner = Game.rooms[creep.memory.ownedBy];
    creep.memory = Object.assign({}, {
      role : creep.memory.role,
      ownedBy : creep.memory.ownedBy,
    },{
      goalIndex : goalIndex,
      isExtracting : true,
      extractionSite : extraction.provide(creep, this.extraction),
      workSiteId : findWorkSite.call(this, creep)
    })
  }

  function findWorkSite(creep){
    let workSites = Game.rooms[creep.memory.ownedBy].find(this.workSite.find, {
      filter : this.workSite.filter
    })

    if(workSites.length > 0){
      const final = workSites[0].id;
      console.log('setting workplace ' + final + ' for ' + this.name);
      return final;
    }else{
      console.log('no workplace found for ' + this.name);
      Game.rooms[creep.memory.ownedBy].checkForNewGoal(creep);
    }
  }
  
  function isExtracting(creep){
    if(creep.memory.isExtracting && creep.carry[this.extraction.resource] === creep.carryCapacity){
      creep.memory.isExtracting = false;
    }else if(!creep.memory.isExtracting && creep.carry[this.extraction.resource] === 0){
      creep.memory.isExtracting = true;
      Game.rooms[creep.memory.ownedBy].checkForNewGoal(creep);
    }
    return creep.memory.isExtracting;
  }

  function dismiss(creep){
    let owner = Game.rooms[creep.memory.ownedBy];
    _.forEach(owner.memory[this.extraction.resource], (siteMemory) => {
      if(_.includes(siteMemory.spaces, (space) => space === creep.name)){
        let indexToDelete = _.findIndex(siteMemory.space, (space) => space === creep.name);
        siteMemory[indexToDelete] = null;
        return false;
      }
    });
  }

  function run(creep){
    if(isExtracting.call(this, creep)){
      const extractionSite = Game.getObjectById(creep.memory.extractionSite.id);
      const method = this.extraction.weightedOrders[creep.memory.extractionSite.index].method;
      switch(method.call(creep, extractionSite)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(extractionSite);
          break;
        }
      }
    }else{
      const workSite = Game.getObjectById(creep.memory.workSiteId);
      const important = this.work.call(creep, workSite, this.extraction.resource);
      switch(important){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(workSite);
          break;
        }
        case ERR_FULL : {
          findWorkSite.call(this, creep);
          break;
        }
        case ERR_INVALID_TARGET : {
          findWorkSite.call(this, creep);
          break;
        }
      }
    }
  }

  return {
    init : init,
    run : run,
    dismiss : dismiss
  }
}();

let HarvesterCarrier = function(){
  ExtractorWorker.call(
    this, 'harvesterCarrier', 'worker',
    extraction.preset.harvesterWorker,  
    Creep.prototype.transfer,
    {
      find : FIND_MY_STRUCTURES,
      filter : function(structure){
        if(structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN){
          return (structure.energy < structure.energyCapacity);
        }else{
          return false;
        }
      }
    }
  )
}

HarvesterCarrier.prototype = ExtractorWorker.prototype;

let HarvesterUpgrader = function(){
  ExtractorWorker.call(
    this, 'harvesterUpgrader', 'worker',
    extraction.preset.harvesterWorker,
    Creep.prototype.upgradeController,
    {
      find : FIND_MY_STRUCTURES,
      filter : function(structure){
        return structure.structureType === STRUCTURE_CONTROLLER
    }
  }
)}

HarvesterUpgrader.prototype = ExtractorWorker.prototype;

let HarvesterBuilder = function(structureType){
  ExtractorWorker.call(
    this, 'harvesterBuilder_' + structureType, 'worker',
    extraction.preset.harvesterWorker,
    Creep.prototype.build,
    {
      find : FIND_MY_CONSTRUCTION_SITES,
      filter : (site) => site.structureType === structureType
    }
  )
}

HarvesterBuilder.prototype = ExtractorWorker.prototype;

module.exports = {
  HarvesterCarrier: HarvesterCarrier,
  HarvesterUpgrader : HarvesterUpgrader,
  HarvesterBuilder : HarvesterBuilder,
}